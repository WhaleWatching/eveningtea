var url_params = decodeURIComponent(window.location.search.slice(1))
                      .split('&')
                      .reduce(function _reduce (/*Object*/ a, /*String*/ b) {
                        b = b.split('=');
                        a[b[0]] = b[1];
                        return a;
                      }, {});

var debug_scene = false;

var debug_speed_up = false;

if(url_params.debug == 'true') {
  debug_scene = true;

  debug_speed_up = true;
}

var debug_dialog = false;

var randomRange = function (start, end, floored) {
  if(floored) {
    return Math.floor(start + Math.random() * (end - start));
  } else {
    return start + Math.random() * (end - start);
  }
}

var musicFadeTo = function (volume, duration, _start_volume) {
  var time_step = duration/40;
  var start_volume;
  if(typeof(_start_volume) === 'undefined') {
    start_volume = cc.audioEngine.getMusicVolume();
  } else {
    start_volume = _start_volume;
  }
  var vol_step = (volume - start_volume) / 40;
  var step = 0;
  var callback = function () {
    // console.log(vol_step, start_volume, step, start_volume + vol_step * step);
    cc.audioEngine.setMusicVolume(start_volume + vol_step * step);
    step++;
    if(step < 41) {
      setTimeout(callback, time_step);
    }
  }
  callback();
}

var effectFadeTo = function (volume, duration, _start_volume) {
  var time_step = duration/40;
  var start_volume;
  if(typeof(_start_volume) === 'undefined') {
    start_volume = cc.audioEngine.getEffectsVolume();
  } else {
    start_volume = _start_volume;
  }
  var vol_step = (volume - start_volume) / 40;
  var step = 0;
  var callback = function () {
    // console.log(vol_step, start_volume, step, start_volume + vol_step * step);
    cc.audioEngine.setEffectsVolume(start_volume + vol_step * step);
    step++;
    if(step < 41) {
      setTimeout(callback, time_step);
    }
  }
  callback();
}

var game_state = {
  state: 0,
  end: false,
  role: {
    speed: 0,
    vector: 0
  }
};

var controller = {
  state: {
    log_position: cc.p(170, 75.5),
    log_width: 560,
    log_content_size: cc.size(560, 62)
  },
  director: {},
  talking: false
};

var TikTok = {
  start_time: 0,
  init: function () {
    this.start_time = new Date();
  },
  getSeconds: function () {
    var now = new Date();
    return Math.floor((now.getTime() - this.start_time.getTime())/1000)
  }
};

var LoaderScene = cc.Scene.extend({
    _interval : null,
    _label : null,
    _className:"LoaderScene",
    init : function(){
        var self = this;
        var logoWidth = 160;
        var logoHeight = 200;
        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(18, 18, 18, 255));
        self.addChild(bgLayer, 0);
        var fontSize = 28, lblHeight =  -logoHeight / 2 + 100;
        var label = self._label = new cc.LabelTTF(logic.loading[0], "Play", 28);
        label.setPosition(cc.p(450, 63));
        label.setColor(cc.color(180, 180, 180));
        label.attr({scale: 0.5});
        bgLayer.addChild(this._label, 10);
        var label_percent = self._label_percent = new cc.LabelTTF("[0%]", "Play", 28);
        label_percent.setPosition(cc.p(450, 82));
        label_percent.setColor(cc.color(180, 180, 180));
        label_percent.attr({scale: 0.5});
        bgLayer.addChild(this._label_percent, 10);
        return true;
    },
    _initStage: function (img, centerPos) {
        var self = this;
        var texture2d = self._texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
    },
    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
    },
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "Finished";
        this._label.setString(tmpStr);
    },
    initWithResources: function (resources, cb) {
        if(cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
    },
    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                var color = Math.floor(((100 - percent)/100) * 18);
                var loading_index = Math.floor(percent / 100 * logic.loading.length);

                self._label.setString(logic.loading[loading_index]);
                self._label_percent.setString('[' + percent + '%]');
                self._bgLayer.stopAllActions();
                self._bgLayer.runAction(cc.tintTo(500, color,color,color));
            }, function () {
                if (self.cb)
                    self.cb();
            });
    }
});
LoaderScene.preload = function(resources, cb){
    var _cc = cc;
    if(!_cc.loaderScene) {
        _cc.loaderScene = new LoaderScene();
        _cc.loaderScene.init();
    }
    _cc.loaderScene.initWithResources(resources, cb);
    cc.director.runScene(_cc.loaderScene);
    return _cc.loaderScene;
};

var ControllerLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();

    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      // onKeyPressed: function (key) {
      //   if(game_state.state > 1) {
      //     if( 88 == key){
      //       var event = new cc.EventCustom("start_shoot");
      //       cc.eventManager.dispatchEvent(event);
      //     }
      //     if(key == cc.KEY.left) {
      //       game_state.role.vector = -10;
      //     }
      //     if(key == cc.KEY.right) {
      //       game_state.role.vector = 10;
      //     }
      //   }
      // },
      onKeyReleased: function (key) {
        if(game_state.state == 2) {
          if(key == cc.KEY.left || key == cc.KEY.right) {
            game_state.role.vector = 0;
          }
          if(key == cc.KEY.z) {
            controller.director.talk();
          }
          if(key == cc.KEY.x) {
            controller.director.tea();
          }
          if(key == cc.KEY.c) {
            controller.director.mountain();
          }
        }
      }
    }, this);
  }
}); 

var BackgroundLayer = cc.LayerColor.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super(cc.color(255, 255, 255));
    var background_position = {
      x: 450,
      y: 200
    };
    
    var BackgroundSunsetSprite = new cc.Sprite(res_img.sprite_background_sunset);
    BackgroundSunsetSprite.texture.setAliasTexParameters();
    BackgroundSunsetSprite.attr(background_position);

    this.addChild(BackgroundSunsetSprite);

    return true;
  }
});

var PressstartLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();

    var PromptSprite = new cc.Sprite(res_img.sprite_pressstart);
    PromptSprite.texture.setAliasTexParameters();
    PromptSprite.attr({
      x: 450,
      y: 70,
      color: cc.color(255,255,255),
      opacity: 0
    });
    this.addChild(PromptSprite, 1);
    var blink = cc.blink(2,1);
    // console.log(blink);
    // PromptSprite.runAction(cc.repeatForever(blink));


    var label = self._label = new cc.LabelTTF(logic.loading[logic.loading.length - 1], "Play", 28);
    label.setPosition(cc.p(450, 63));
    label.setColor(cc.color(180, 180, 180));
    label.attr({scale: 0.5});
    this.addChild(this._label, 10);
    var label_percent = self._label_percent = new cc.LabelTTF("[100%]", "Play", 28);
    label_percent.setPosition(cc.p(450, 82));
    label_percent.setColor(cc.color(180, 180, 180));
    label_percent.attr({scale: 0.5});
    this.addChild(this._label_percent, 10);
    var label_press = self._label_press = new cc.LabelTTF(" - PRESS X TO START -", "Play", 36);
    label_press.setPosition(cc.p(450, 120));
    label_press.setColor(cc.color(180, 180, 180));
    label_press.attr({scale: 0.5});
    this.addChild(this._label_press, 10);
    label_press.runAction(cc.repeatForever(blink));

    var PressBgLSprite = new cc.Sprite(res_img.sprite_press_bg);
    PressBgLSprite.texture.setAliasTexParameters();
    PressBgLSprite.attr({
      x: 0,
      y: 0,
      scaleX: 450,
      scaleY: 400,
      anchorX: 0,
      anchorY: 0
    });
    this.addChild(PressBgLSprite);

    var PressBgRSprite = new cc.Sprite(res_img.sprite_press_bg);
    PressBgRSprite.texture.setAliasTexParameters();
    PressBgRSprite.attr({
      x: 450,
      y: 0,
      scaleX: 450,
      scaleY: 400,
      anchorX: 0,
      anchorY: 0
    });
    this.addChild(PressBgRSprite);

    var is_gone = false;

    controller.director.pressstartEnd = function () {
      PressBgLSprite.runAction(cc.moveTo(1, cc.p(0, 0)).easing(cc.easeIn(3.0)) );
      PressBgRSprite.runAction(cc.moveTo(1, cc.p(450, 0)).easing(cc.easeIn(3.0)) );
    }

    this.blow = function () {
      PressBgLSprite.runAction(cc.moveTo(1, cc.p(-450, 0)).easing(cc.easeIn(3.0)) );
      PressBgRSprite.runAction(cc.moveTo(1, cc.p(900, 0)).easing(cc.easeIn(3.0)) );
      label_press.stopAllActions();
      label.attr({opacity: 0});
      label_percent.attr({opacity: 0});
      label_press.attr({opacity: 0});
    }

    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed: function (key) {
        if(88 === key && is_gone != true && game_state.state == 0) {
          is_gone = true;
          // self.runAction(cc.sequence(cc.fadeOut(2), cc.callFunc(function () {
          //   this.parent.removeChild(this);
          // }, self)));
          // console.log(cc.moveTo(2, cc.p(-450, 0)));
          self.blow();
          // cc.audioEngine.playMusic(res_img.sprite_prelude, true);
          // audio_tree.background.setVolume(0).play().fadeTo(audio_tree.background._start_volume, 3000);
          // audio_tree.curtain.play();
          musicFadeTo(1, 3000, 0);
          cc.audioEngine.playMusic(res_audio.audio_ambient, true);
          // cc.audioEngine.playEffect(res_audio.audio_opening, false);
          self.runAction(cc.sequence(cc.delayTime(0.7), cc.callFunc(function () {
            var event = new cc.EventCustom("pressstart_gone");
            cc.eventManager.dispatchEvent(event);
            game_state.state = 1;
            TikTok.init();
          }, self)));
        }
      }
    }, this);

    return true;
  }
});

var TitleLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();
    var TitleSprite = new cc.Sprite(res_img.sprite_words_title);
    TitleSprite.texture.setAliasTexParameters();
    TitleSprite.attr({
      x: 450,
      y: 55,
      opacity: 0
    });
    this.addChild(TitleSprite);

    var pressstart_gone_listener = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "pressstart_gone",
        callback: function(event){
          if(debug_speed_up) {
              var event = new cc.EventCustom("game_start");
              cc.eventManager.dispatchEvent(event);
          } else {
            TitleSprite.runAction(cc.sequence( cc.fadeIn(1.2),cc.delayTime(3.8), cc.callFunc(function () {
                var event = new cc.EventCustom("game_start");
                cc.eventManager.dispatchEvent(event);
                game_state.state = 2;
              }, this) // ,cc.delayTime(2), cc.fadeOut(0.4)
            ));
          }
        }
    });    
    cc.eventManager.addListener(pressstart_gone_listener, 1);

    var key_pressed_listener = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "key_pressed",
        callback: function(event){
              TitleSprite.runAction(cc.fadeOut(0.4));
        }
    });    
    cc.eventManager.addListener(key_pressed_listener, 1);

    var start_shoot_listener = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "start_shoot",
        callback: function(event){
            TitleSprite.runAction(cc.fadeOut(0.5));
        }
    });    
    cc.eventManager.addListener(start_shoot_listener, 1);

    return true;
  }
});

var UiLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();
    var UiLeftSprite = new cc.Sprite(res_img.sprite_ui_left);
    var UiRightSprite = new cc.Sprite(res_img.sprite_ui_right);
    UiLeftSprite.texture.setAliasTexParameters();
    UiRightSprite.texture.setAliasTexParameters();
    UiLeftSprite.attr({
      x: 17.5,
      y: 13.5,
      opacity: 0,
      anchorX: 0,
      anchorY: 0
    });
    UiRightSprite.attr({
      x: 900 - 17.5,
      y: 13.5,
      opacity: 0,
      anchorX: 1,
      anchorY: 0
    });
    this.addChild(UiLeftSprite);
    this.addChild(UiRightSprite);

    var UiShootSprite = new cc.Sprite(res_img.sprite_ui_shoot);
    UiShootSprite.texture.setAliasTexParameters();
    UiShootSprite.attr({
      x: 800,
      y: 240,
      opacity: 0
    });
    this.addChild(UiShootSprite);

    var hp = {
      player: 0.35,
      boss: 0.60
    }

    var UiHpPlayerSprite =  new cc.Sprite(res_img.sprite_ui_hp);
    UiHpPlayerSprite.texture.setAliasTexParameters();
    UiHpPlayerSprite.attr({
      x: 830.5,
      y: 38.5,
      opacity: 0,
      anchorX: 1,
      anchorY: 0
    });
    UiHpPlayerSprite.runAction(cc.scaleTo(0.1, hp.player, 1));
    this.addChild(UiHpPlayerSprite, 20);
    var UiHpBackPlayerSprite =  new cc.Sprite(res_img.sprite_ui_hp);
    UiHpBackPlayerSprite.texture.setAliasTexParameters();
    UiHpBackPlayerSprite.attr({
      x: 830.5,
      y: 38.5,
      opacity: 255,
      anchorX: 1,
      anchorY: 0,
      color: cc.color(64, 64, 64, 255)
    });
    UiHpBackPlayerSprite.runAction(cc.scaleTo(0.1, hp.player, 1));
    this.addChild(UiHpBackPlayerSprite, 10);

    var UiHpBossSprite =  new cc.Sprite(res_img.sprite_ui_hp);
    UiHpBossSprite.texture.setAliasTexParameters();
    UiHpBossSprite.attr({
      x: 68.5,
      y: 38.5,
      opacity: 0,
      anchorX: 0,
      anchorY: 0
    });
    UiHpBossSprite.runAction(cc.scaleTo(0.1, hp.boss, 1));
    this.addChild(UiHpBossSprite, 20);
    var UiHpBackBossSprite =  new cc.Sprite(res_img.sprite_ui_hp);
    UiHpBackBossSprite.texture.setAliasTexParameters();
    UiHpBackBossSprite.attr({
      x: 68.5,
      y: 38.5,
      opacity: 255,
      anchorX: 0,
      anchorY: 0,
      color: cc.color(64, 64, 64, 255)
    });
    UiHpBackBossSprite.runAction(cc.scaleTo(0.1, hp.boss, 1));
    this.addChild(UiHpBackBossSprite, 10);

    controller.director.isFullHp = function () {
      if(hp.boss == 1 || hp.player == 1) {
        return true;
      } else {
        return false;
      }
    }

    controller.director.hp = function (role, action) {
      var offset = 0;
      if('more' == action) {
        offset = 0.05;
      }
      if('less' == action) {
        offset = -0.05;
      }
      var target = {};
      var target_back = {};
      var target_hp = 0;
      if('player' == role) {
        target = UiHpPlayerSprite;
        target_back = UiHpBackPlayerSprite;
        target_hp = hp.player;
      } else if('boss' == role) {
        target = UiHpBossSprite;
        target_back = UiHpBackBossSprite;
        target_hp = hp.boss;
      } else {
        return;
      }
      var target_size = target_hp + offset;
      if(target_size >= 1) {
        target_size = 1;
        if(target_hp == 1) {
          return;
        }
      } else if(target_size < 0) {
        target_size = 0;
      }
      if(target_size >= 0.8) {
        controller.input.switchState('mountain', true);
      }
      if('player' == role) {
        hp.player = target_size;
      } else {
        hp.boss = target_size;
      }
      target.runAction(cc.sequence(cc.blink(0.8, 4), cc.delayTime(0.3), cc.scaleTo(1.7, target_size, 1)));
      target_back.runAction(cc.sequence(cc.blink(0.8, 4), cc.delayTime(0.3), cc.scaleTo(0.2, target_size, 1)));
    }

    var UiBossBullets = [];
    for (var i = 0; i < 0; i++) {
      var bullet =  new cc.Sprite(res_img.sprite_ui_bullet);
      bullet.attr({
        x: 23 + i * 7,
        y: 19,
        opacity: 0
      });
      UiBossBullets.push(bullet);
      this.addChild(bullet);
    };

    var UiRoleBullets = [];
    for (var i = 0; i < 0; i++) {
      var bullet =  new cc.Sprite(res_img.sprite_ui_bullet);
      bullet.attr({
        x: 876 - i * 7,
        y: 18,
        opacity: 0
      });
      UiRoleBullets.push(bullet);
      this.addChild(bullet);
    };

    // var game_start_listener = cc.EventListener.create({
    //     event: cc.EventListener.CUSTOM,
    //     eventName: "game_start",
    //     callback: function(event){
    //           // UiShootSprite.runAction(cc.fadeIn(1));
    //           console.log('remove shoot');
    //         }
    // }, this);
    // cc.eventManager.addListener(game_start_listener, 1);

    var start_shoot_listener = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "pressstart_gone",
        callback: function(event){
            UiLeftSprite.runAction(cc.fadeIn(2.6));
            UiRightSprite.runAction(cc.fadeIn(2.6));
            UiHpBossSprite.runAction(cc.fadeIn(2.6));
            UiHpPlayerSprite.runAction(cc.fadeIn(2.6));
            for (var i = 0; i < UiBossBullets.length; i++) {
              UiBossBullets[i].runAction(cc.fadeIn(2.6));
            };
            for (var i = 0; i < UiRoleBullets.length; i++) {
              UiRoleBullets[i].runAction(cc.fadeIn(2.6));
            };
            UiShootSprite.runAction(cc.fadeOut(0.1));
        }
    });    
    cc.eventManager.addListener(start_shoot_listener, 1);

    return true;
  }
});

var RoleLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();
    this.scheduleUpdate();

    this.role_sprite = new cc.Sprite(res_img.sprite_role);
    this.role_sprite.attr({
      x: 840,
      y: 165
    });
    this.addChild(this.role_sprite);
  },
  update: function (delta) {
    game_state.role.speed += game_state.role.vector;
    game_state.role.speed = game_state.role.speed * 0.8;
    if(game_state.role.speed > 150)
      game_state.role.speed = 150;
    this.role_sprite.x = this.role_sprite.x + delta * 10 * game_state.role.speed;
    if(this.role_sprite.x < 200)
      this.role_sprite.x = 200;
    if(this.role_sprite.x > 880)
      this.role_sprite.x = 880;
  }
});

var BossLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();

    var draw_pen = new cc.DrawNode();
    draw_pen.drawRect(new cc.Point(70,115), new cc.Point(130, 210), cc.color(255,255,255,200), 0, cc.color(0,0,0,0));
    this.addChild(draw_pen);
  }
});

var SunLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();
    var frames = [];
    for (var i = 0; i < 8; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_sun,cc.rect(i*237,0,237,68));
      frames.push(sprite_frame);
    };
    var SunAnimation = new cc.Animation(frames, 0.2);
    // console.log('SunAnimation', SunAnimation);
    var sprite_sun = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_sun,cc.rect(0,0,237,68)));
    sprite_sun.attr({x:305,y:218});
    // sprite_sun.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    this.addChild(sprite_sun, 1);
    sprite_sun.runAction(cc.repeatForever( cc.animate(SunAnimation)));
  }
});

var SunlightLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();


    var sprite_sunlight = new cc.Sprite(res_img.sprite_sunlight);
    // sprite_sunlight.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    // sprite_sunlight.setBlendFunc(gl.SRC_ALPHA, gl.DST_COLOR);
    // sprite_sunlight.setBlendFunc(gl.DST_COLOR, gl.ONE);
    sprite_sunlight.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    sprite_sunlight.attr({x:390,y:200});
    var sunlight_animation = function () {
      var light = 220 + 35 * Math.random();
      // console.log(light);
      this.runAction(
        cc.sequence(
          cc.fadeTo(0.1 + 0.4 * Math.random(),light),cc.delayTime(0.4 + 0.8 * Math.random()),
          cc.callFunc(sunlight_animation, this))
      );
    };
    sunlight_animation.apply(sprite_sunlight);
    this.addChild(sprite_sunlight);
  }
});

var IslandsLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();


    sprite_mountain = new cc.Sprite(res_img.sprite_mountain);
    sprite_mountain.attr({
      x: 497,
      y: 310,
      opacity: 0
    });
    this.addChild(sprite_mountain, 0);

    controller.director.showMountain = function () {
      sprite_mountain.runAction(cc.fadeIn(2));
    }


    var sprite_islands = new cc.Sprite(res_img.sprite_island);
    sprite_islands.texture.setAliasTexParameters();
    // sprite_islands.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    sprite_islands.attr({x:450,y:238});
    this.addChild(sprite_islands, 10);

    var frames_ref1 = [];
    for (var i = 0; i < 8; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_ref1,cc.rect(i*127,0,127,48));
      frames_ref1.push(sprite_frame);
    };
    var Ref1Animation = new cc.Animation(frames_ref1, 0.2);
    // console.log('Ref1Animation', Ref1Animation);
    var sprite_ref1 = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_ref1,cc.rect(0,0,127,48)));
    sprite_ref1.attr({x:58,y:223, opacity: 170});
    sprite_ref1.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_ref1.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_ref1.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_ref1, 1);
    sprite_ref1.runAction(cc.repeatForever( cc.animate(Ref1Animation)));

    var frames_ref2 = [];
    for (var i = 0; i < 8; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_ref2,cc.rect(0,i*65,368,65));
      frames_ref2.push(sprite_frame);
    };
    var Ref2Animation = new cc.Animation(frames_ref2, 0.2);
    // console.log('Ref2Animation', Ref2Animation);
    var sprite_ref2 = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_ref2,cc.rect(0,0,368,65)));
    sprite_ref2.texture.setAliasTexParameters();
    sprite_ref2.attr({x:577,y:220, opacity: 170});
    sprite_ref2.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_ref2.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_ref2.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_ref2, 1);
    sprite_ref2.runAction(cc.repeatForever( cc.animate(Ref2Animation)));

    var frames_ref3 = [];
    for (var i = 0; i < 8; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_ref3,cc.rect(i*101,0,101,65));
      frames_ref3.push(sprite_frame);
    };
    var Ref3Animation = new cc.Animation(frames_ref3, 0.2);
    // console.log('Ref3Animation', Ref3Animation);
    var sprite_ref3 = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_ref3,cc.rect(0,0,101,65)));
    sprite_ref3.texture.setAliasTexParameters();
    sprite_ref3.attr({x:855,y:209, opacity: 170});
    sprite_ref3.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_ref3.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_ref3.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_ref3, 1);
    sprite_ref3.runAction(cc.repeatForever( cc.animate(Ref3Animation)));
  }
});



var DustLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();

    var DustPart = new cc.ParticleSystem(res_plist.p_dust);
    DustPart.setStartColor(cc.color(217, 191, 77, 127));
    DustPart.setStartColorVar(cc.color(0, 0, 0, 127));
    DustPart.setEndColor(cc.color(217, 191, 77, 0));
    DustPart.setEndColorVar(cc.color(0, 0, 0, 255));
    DustPart.setEmissionRate(20);
    DustPart.setLife(10);
    DustPart.setAngleVar(10);
    DustPart.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    DustPart.attr({x: 0, y: 600});
    // console.log(DustPart);
    this.addChild(DustPart);

    return true;
  }
});

var WaterLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();

    var lights = [];
    var range = {
      center: {x: 308, y: 149},
      random: {x: 587, y: 85, left: 309},
      random_pick: {x: Math.pow(587,2), y: Math.pow(85,2), left: Math.pow(309,2)}
    };

    var lights_call = function () {
      var position_x = 0;
      if (Math.random() > 0.7) {
        position_x = range.center.x - range.random.left + Math.sqrt(Math.random() * range.random_pick.left);
      } else {
        position_x = range.center.x + range.random.x - Math.sqrt(Math.random() * range.random_pick.x);
      }
      var position_y = range.center.y + Math.sqrt(Math.random() * range.random_pick.y);
      position_x = Math.floor(position_x) + 0.5;
      position_y = Math.floor(position_y) + 0.5;
      var animation_time = 0.2+Math.random()*0.4;
      this.attr({x: position_x, y: position_y, opacity: 0});
      if(Math.random() > 1) {
        this.attr({scaleY: 3+Math.random()*7, scaleX: 1});
      } else {
        this.attr({scaleX: 10+Math.random()*47, scaleY: 1});
      }
      this.runAction(cc.sequence(cc.fadeIn(animation_time), cc.fadeOut(animation_time), cc.callFunc(function  (argument) {
        lights_call.apply(this);
      }, this)));
    }

    for (var i = 0; i < 160; i++) {
      var SpriteLight = new cc.Sprite(res_img.sprite_light);
      SpriteLight.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      lights_call.apply(SpriteLight);
      this.addChild(SpriteLight);
    };

    


    return true;
  }
});

var GroundLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();
    this.scheduleUpdate();

    var GrassSprite = new cc.Sprite(res_img.sprite_grass);
    GrassSprite.attr({x: 451, y: 159});
    GrassSprite.texture.setAliasTexParameters();
    this.addChild(GrassSprite);

    var Weapon1Sprite = new cc.Sprite(res_img.sprite_weapon1);
    Weapon1Sprite.attr({x: 880, y: 192});
    Weapon1Sprite.texture.setAliasTexParameters();
    this.addChild(Weapon1Sprite, 1);

    var Weapon2Sprite = new cc.Sprite(res_img.sprite_weapon2);
    Weapon2Sprite.attr({x: 227, y: 191});
    Weapon2Sprite.texture.setAliasTexParameters();
    this.addChild(Weapon2Sprite, 1);

    var TableSprite = new cc.Sprite(res_img.sprite_table);
    TableSprite.attr({x: 437, y: 180});
    TableSprite.texture.setAliasTexParameters();
    this.addChild(TableSprite, 1);


    var frames_fire = [];
    for (var i = 0; i < 8; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_fire,cc.rect(0,i*148,227,148));
      frames_fire.push(sprite_frame);
    };
    var FireAnimation = new cc.Animation(frames_fire, 0.13);
    // console.log('FireAnimation', FireAnimation);
    var sprite_fire = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_fire,cc.rect(0,0,227,148)));
    sprite_fire.texture.setAliasTexParameters();
    sprite_fire.attr({x:725,y:151});
    // sprite_fire.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_fire.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_fire.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_fire, 1);
    sprite_fire.runAction(cc.repeatForever( cc.animate(FireAnimation)));



    var Light = function (x, y, parent) {
      var self = this;
      this.start_location = {
        x: x,
        y: y
      };
      this.location = {
        x: 0,
        y: 0
      };
      this.speed = {
        x: 0,
        y: 0
      };
      this.vector = {
        x: 0,
        y: 0,
        r: 0
      };
      this.life = 0;
      this.sprite = new cc.Sprite(res_img.sprite_light_fire);
      parent.addChild(this.sprite);
      this.opacity = 1;
      this.current_life = 0;
      this.apply = function () {
        this.sprite.attr({x: this.location.x, y: this.location.y});
      }
      this.reset = function () {
        // console.log(this);
        var color;
        if(Math.random() > 0.66) {
          color = cc.color(255,206,49);
        } else if (Math.random() > 0.5) {
          color = cc.color(255,157,1);
        } else {
          color = cc.color(255,99,0);
        }
        this.sprite.attr({opacity: 255, color: color});
        this.life = randomRange(1, 4);
        this.current_life = 0;
        this.location.x = randomRange(this.start_location.x - 20, this.start_location.x + 20);
        this.location.y = randomRange(this.start_location.y - 8, this.start_location.y + 8);
        this.speed = {
          x: randomRange(-100, 100, true),
          y: randomRange(100, 170, true)
        };
        this.vector = {
          x: randomRange(80, 120, true),
          y: randomRange(-20, -8, true),
          r: 0.8
        };
        this.apply();
        this.color();
      }
      this.color = function () {
        this.opacity = (this.life - this.current_life) / this.life;
        if(this.opacity < 0) {
          this.reset();
          return;
        }
        this.sprite.runAction(cc.sequence(cc.fadeTo(randomRange(0.1, 0.3),255 * this.opacity), cc.delayTime(randomRange(0.1, 0.3)), cc.fadeTo(randomRange(0.1, 0.3), 0.2 * this.opacity), cc.callFunc(function () {
          this.color();
        }, this)));
      }
      this.update = function (delta) {
        this.current_life += delta;
        this.speed.x += this.vector.x * delta;
        this.speed.y += this.vector.y * delta;
        // console.log((1 - this.vector.r * delta));
        this.speed.x *= (1 - this.vector.r * delta);
        this.speed.y *= (1 - this.vector.r * delta);
        this.location.x += this.speed.x * delta;
        this.location.y += this.speed.y * delta;
        this.apply();
      }
      setTimeout(function() {
        self.reset();
      }, randomRange(0, 1000, true));
    }

    var fireLights = function () {
      var lights = [];
      var lights_container = new cc.Node();
      lights_container.attr({x:0, y:0});
      self.addChild(lights_container, 5);
      for (var i = 0; i < 6; i++) {
        lights.push(new Light(681, 139, lights_container));
      }
      for (var i = 0; i < 12; i++) {
        lights.push(new Light(731, 139, lights_container));
      }
      for (var i = 0; i < 4; i++) {
        lights.push(new Light(781, 139, lights_container));
      }
      // console.log('lights_container', lights_container);
      // console.log('lights', lights);
      return lights;
    }

    this.lights = fireLights();

    this.fireLightUpdate = function (delta) {
      this.lights.forEach(function (light) {
        light.update(delta);
      });
    }

    var frames_katana = [];
    for (var i = 0; i < 4; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_katana,cc.rect(i*76,0,76,185));
      frames_katana.push(sprite_frame);
    };
    var KatanaAnimation = new cc.Animation(frames_katana, 0.18);
    // console.log('KatanaAnimation', KatanaAnimation);
    var sprite_katana = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_katana,cc.rect(0,0,76,185)));
    sprite_katana.texture.setAliasTexParameters();
    sprite_katana.attr({x:805,y:186});
    // sprite_katana.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_katana.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_katana.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_katana, 1);
    sprite_katana.runAction(cc.repeatForever( cc.animate(KatanaAnimation)));

    var frames_spear = [];
    for (var i = 0; i < 4; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_spear,cc.rect(i*78,0,78,318));
      frames_spear.push(sprite_frame);
    };
    var SpearAnimation = new cc.Animation(frames_spear, 0.18);
    // console.log('SpearAnimation', SpearAnimation);
    var sprite_spear = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_spear,cc.rect(0,0,78,318)));
    sprite_spear.texture.setAliasTexParameters();
    sprite_spear.attr({x:70,y:239});
    // sprite_spear.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_spear.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_spear.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_spear, 1);
    sprite_spear.runAction(cc.repeatForever( cc.animate(SpearAnimation)));

    return true;
  },
  update: function (delta) {
    this.fireLightUpdate(delta);
  }
});

var IdleLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();

    var frames_player = [];
    for (var i = 0; i < 12; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_player,cc.rect(i*165,0,165,223));
      frames_player.push(sprite_frame);
    };
    var PlayerAnimation = new cc.Animation(frames_player, 0.18);
    // console.log('PlayerAnimation', PlayerAnimation);
    var sprite_player = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_player,cc.rect(0,0,165,223)));
    sprite_player.texture.setAliasTexParameters();
    sprite_player.attr({x:552,y:213});
    this.addChild(sprite_player, 1);
    sprite_player.runAction(cc.repeatForever( cc.animate(PlayerAnimation)));

    var frames_boss = [];
    for (var i = 0; i < 12; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_boss,cc.rect(i*162,0,162,203));
      frames_boss.push(sprite_frame);
    };
    var BossAnimation = new cc.Animation(frames_boss, 0.18);
    // console.log('BossAnimation', BossAnimation);
    var sprite_boss = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_boss,cc.rect(0,0,162,203)));
    sprite_boss.texture.setAliasTexParameters();
    sprite_boss.attr({x:342,y:207});
    this.addChild(sprite_boss, 1);
    sprite_boss.runAction(cc.repeatForever( cc.animate(BossAnimation)));

    return true;
  }
});

var LogicLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();

    var input = {
      tea: false,
      talk: false,
      mountain: false,
      tea_inited: false,
      mountain_inited: false,
      talk_inited: false,
      switchState: function (target, state) {
        if(game_state.end) {
          return;
        }
        if (typeof(target) == 'string' && typeof(state) == 'boolean') {
          if(state) {
            switch(target) {
              case 'tea':
                if(!controller.talking) {
                  input.sprite_ui_tea.runAction(cc.fadeIn(0.1));
                }
                if(!input.tea_inited) {
                  TeaPlayerStartSprite.runAction(cc.fadeOut(1));
                  TeapotSprite.runAction(cc.fadeIn(1));
                  sprite_tea_player.runAction(cc.fadeIn(1));
                  sprite_tea_boss.runAction(cc.fadeIn(1));
                  setTimeout(function() {
                    cc.audioEngine.playEffect(res_audio.audio_show_tea, false);
                  }, 700);
                  input.tea_inited = true;
                }
                input.tea = true;
                break;
              case 'talk':
                input.talk = true;
                if(!input.talk_inited) {
                  input.sprite_ui_talk.blink_animation = input.sprite_ui_talk.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(1, 32),cc.fadeTo(1, 255))));
                  input.talk_inited = true;
                  break;
                }
                if(!controller.talking) {
                  input.sprite_ui_talk.runAction(cc.fadeIn(0.1));
                }
                break;
              case 'mountain':
                if(!controller.talking) {
                  input.sprite_ui_mountain.runAction(cc.fadeIn(0.1));
                }
                if(!input.mountain_inited) {
                  controller.director.showMountain();
                  input.mountain_inited = true;
                }
                input.mountain = true;
                break;
            }
          } else {
            switch(target) {
              case 'tea':
                // input.sprite_ui_tea.runAction(cc.fadeOut(0.1));
                input.tea = false;
                break;
              case 'talk':
                input.sprite_ui_talk.runAction(cc.fadeOut(0.1));
                input.talk = false;
                break;
              case 'mountain':
                input.sprite_ui_mountain.runAction(cc.fadeOut(0.1));
                input.mountain = false;
                break;
            }
          }
        }
      },
      duringStart: function (only_logic) {
        if(game_state.end) {
          return;
        }
        if(!only_logic) {
          if(input.sprite_ui_tea.fade_in_action) {
            input.sprite_ui_tea.fade_in_action.stop();
          }
          input.sprite_ui_tea.runAction(cc.fadeOut(0.1));
          if(input.sprite_ui_talk.fade_in_action) {
            input.sprite_ui_talk.fade_in_action.stop();
          }
          if(input.sprite_ui_talk.blink_animation) {
            // console.log(input.sprite_ui_talk.blink_animation);
            input.sprite_ui_talk.stopAllActions();
            input.sprite_ui_talk.attr({opacity: 0});
            input.sprite_ui_talk.blink_animation = false;
          }
          input.sprite_ui_talk.runAction(cc.fadeOut(0.1));
          if(input.sprite_ui_mountain.fade_in_action) {
            input.sprite_ui_mountain.fade_in_action.stop();
          }
          input.sprite_ui_mountain.runAction(cc.fadeOut(0.1));
        }
        controller.talking = true;
      },
      duringEnd: function (only_logic) {
        if(game_state.end) {
          return;
        }
        if(!only_logic) {
          if(input.tea_inited) {
            input.sprite_ui_tea.fade_in_action = input.sprite_ui_tea.runAction(cc.fadeIn(0.1));
          }
          if(input.talk) {
            input.sprite_ui_talk.fade_in_action = input.sprite_ui_talk.runAction(cc.fadeIn(0.1));
          }
          if(input.mountain) {
            input.sprite_ui_mountain.fade_in_action = input.sprite_ui_mountain.runAction(cc.fadeIn(0.1));
          }
        }
        controller.talking = false;
      },
      blinkTea: function () {
        if(input.sprite_ui_tea.blink_action) {
          input.sprite_ui_tea.blink_action.stop();
        }
        input.sprite_ui_tea.blink_action = input.sprite_ui_tea.runAction(cc.blink(0.6, 3));
      },
      end: function () {
        input.sprite_ui_tea.runAction(cc.fadeOut(0.1));
        input.sprite_ui_talk.runAction(cc.fadeOut(0.1));
        input.sprite_ui_mountain.runAction(cc.fadeOut(0.1));
      }
    };
    controller.input = input;

    input.sprite_ui_tea = new cc.Sprite(res_img.sprite_ui_tea);
    input.sprite_ui_tea.attr({
      x: 615,
      y: 220,
      anchorX: 0,
      opacity: 0
    });
    this.addChild(input.sprite_ui_tea);

    input.sprite_ui_talk = new cc.Sprite(res_img.sprite_ui_talk);
    input.sprite_ui_talk.attr({
      x: 615,
      y: 240,
      anchorX: 0,
      opacity: 0
    });
    this.addChild(input.sprite_ui_talk);

    input.sprite_ui_mountain = new cc.Sprite(res_img.sprite_ui_mountain);
    input.sprite_ui_mountain.attr({
      x: 615,
      y: 200,
      anchorX: 0,
      opacity: 0
    });
    this.addChild(input.sprite_ui_mountain);


    // END

    var ammo_player = [];
    for (var i = 0; i < 12; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_ammo,cc.rect(i*185,0,185,200));
      ammo_player.push(sprite_frame);
    };
    var AmmoAnimation = new cc.Animation(ammo_player, 0.10);
    // console.log('AmmoAnimation', AmmoAnimation);
    var sprite_ammo = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_ammo,cc.rect(0,0,185,200)));
    sprite_ammo.texture.setAliasTexParameters();
    sprite_ammo.attr({x:438,y:300,opacity:0});
    this.addChild(sprite_ammo, 10);

    controller.director.end = function () {
      game_state.state = 3;
      game_state.end = true;
      clearFill();
      log_clear();
      input.end();
      sprite_ammo.attr({opacity:255});
      sprite_ammo.runAction(cc.sequence(cc.animate(AmmoAnimation), cc.delayTime(10),cc.callFunc(function () {
        musicFadeTo(0, 3000);
        controller.director.pressstartEnd();
      })));
      cc.audioEngine.playEffect(res_audio.audio_ammo_teleport);
      setTimeout(function() {
        cc.audioEngine.playEffect(res_audio.audio_ammo_crush);
      }, 750);
    }


    // TEA


    var TeapotSprite = new cc.Sprite(res_img.sprite_teapot);
    TeapotSprite.attr({x: 436, y: 219, opacity: 0});
    TeapotSprite.texture.setAliasTexParameters();
    this.addChild(TeapotSprite, 1);

    var TeaPlayerStartSprite = new cc.Sprite(res_img.sprite_tea_player_start);
    TeaPlayerStartSprite.attr({x:544,y:234});
    TeaPlayerStartSprite.texture.setAliasTexParameters();
    this.addChild(TeaPlayerStartSprite, 1);


    var TeaPlayerPart = new cc.ParticleSystem(res_plist.p_tea);
    TeaPlayerPart.setStartColor(cc.color(255, 255, 255, 160));
    TeaPlayerPart.setStartColorVar(cc.color(0, 0, 0, 50));
    TeaPlayerPart.setEndColor(cc.color(255, 255, 255, 0));
    TeaPlayerPart.setEndColorVar(cc.color(0, 0, 0, 0));
    TeaPlayerPart.setEmissionRate(0);
    TeaPlayerPart.setPosVar(cc.p(3, 0));
    TeaPlayerPart.setLife(0.17);
    // TeaPlayerPart.setAngleVar(10);
    // TeaPlayerPart.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    TeaPlayerPart.attr({x: 520, y: 212});
    // console.log(TeaPlayerPart);
    this.addChild(TeaPlayerPart);
    var TeaBossPart = new cc.ParticleSystem(res_plist.p_tea);
    TeaBossPart.setStartColor(cc.color(255, 255, 255, 160));
    TeaBossPart.setStartColorVar(cc.color(0, 0, 0, 50));
    TeaBossPart.setEndColor(cc.color(255, 255, 255, 0));
    TeaBossPart.setEndColorVar(cc.color(0, 0, 0, 0));
    TeaBossPart.setEmissionRate(0);
    TeaBossPart.setPosVar(cc.p(3, 0));
    TeaBossPart.setLife(0.17);
    // TeaBossPart.setAngleVar(10);
    // TeaBossPart.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    TeaBossPart.attr({x: 370, y: 212});
    // console.log(TeaBossPart);
    this.addChild(TeaBossPart);

    var switchTeaPart = function (role, state) {
      if(state>0) {
        if(role == 'player') {
          TeaPlayerPart.setLife(0.1 + state * 0.15);
          TeaPlayerPart.setEmissionRate(5 + state * logic.tea_fog_size);
          // console.log('player EmissionRate', 5 + state * logic.tea_fog_size);
        } else {
          TeaBossPart.setLife(0.1 + state * 0.15);
          TeaBossPart.setEmissionRate(5 + state * logic.tea_fog_size);
          // console.log('boss EmissionRate', 5 + state * logic.tea_fog_size);
        }
      } else {
        if(role == 'player') {
          TeaPlayerPart.setEmissionRate(0);
        } else {
          TeaBossPart.setEmissionRate(0);
        }
      }
    }

    // Tea fills boss
    var frames_tea_left = [];
    for (var i = 0; i < 14; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_tea_left,cc.rect(0,51*i,110,51));
      frames_tea_left.push(sprite_frame);
    };
    for (var i = 13; i >= 0; i--) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_tea_left,cc.rect(0,51*i,110,51));
      frames_tea_left.push(sprite_frame);
    };
    var TeaLeftAnimation = new cc.Animation(frames_tea_left, 0.10);
    TeaLeftAnimation._frames[14].setDelayUnits(25);
    TeaLeftAnimation._totalDelayUnits += 24;
    // console.log('TeaLeftAnimation', TeaLeftAnimation);
    var sprite_tea_left = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_tea_left,cc.rect(0,0,110,51)));
    sprite_tea_left.texture.setAliasTexParameters();
    sprite_tea_left.attr({x:415,y:223,opacity: 0});
    this.addChild(sprite_tea_left, 1);
    animate_tea_player = cc.animate(TeaLeftAnimation);
    // sprite_tea_left.runAction(cc.repeatForever( cc.animate(TeaLeftAnimation)));

    // Tea fills player
    var frames_tea_right = [];
    for (var i = 0; i < 17; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_tea_right,cc.rect(0,53*i,126,53));
      frames_tea_right.push(sprite_frame);
    };
    for (var i = 16; i >= 0; i--) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_tea_right,cc.rect(0,53*i,126,53));
      frames_tea_right.push(sprite_frame);
    };
    var TeaRightAnimation = new cc.Animation(frames_tea_right, 0.10);
    TeaRightAnimation._frames[17].setDelayUnits(25);
    TeaRightAnimation._totalDelayUnits += 24;
    // console.log('TeaRightAnimation', TeaRightAnimation);
    var sprite_tea_right = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_tea_right,cc.rect(0,0,126,53)));
    sprite_tea_right.texture.setAliasTexParameters();
    sprite_tea_right.attr({x:465,y:224,opacity: 0});
    this.addChild(sprite_tea_right, 1);
    animate_tea_player = cc.animate(TeaRightAnimation);
    // sprite_tea_right.runAction(cc.repeatForever( cc.animate(TeaRightAnimation)));

    clearFill = function () {
      TeapotSprite.attr({opacity: 255});
      sprite_tea_right.attr({opacity:0});
      sprite_tea_left.attr({opacity:0});
    }

    var tea_filling = false;
    var tea_filling_queue = false;
    controller.director.fill = function (role) {
      if(game_state.end) {
        return;
      }
      if(tea_filling) {
        logic_state.filling_tea[role] = true;
        tea_filling_queue = role;
        return;
      }
      TeapotSprite.attr({opacity: 0});
      var finish = function () {
        TeapotSprite.attr({opacity: 255});
        if(tea_filling_queue) {
          controller.director.fill(tea_filling_queue);
          tea_filling_queue = false;
        }
      }
      if(role == 'player') {
        tea_filling = true;
        logic_state.filling_tea.player = true;
        sprite_tea_right.attr({opacity:255});
        sprite_tea_right.runAction(cc.sequence(cc.delayTime(0.2), cc.animate(TeaRightAnimation),cc.callFunc(function () {
          tea_filling = false;
          sprite_tea_right.attr({opacity:0});
          logic_state.filling_tea.player = false;
          finish();
        })));
        setTimeout(function() {
          cc.audioEngine.playEffect(res_audio.audio_tea_filling);
          fillTeaPart('player');
        }, 1900);
      } else {
        logic_state.filling_tea.boss = true;
        sprite_tea_left.attr({opacity:255});
        sprite_tea_left.runAction(cc.sequence(cc.delayTime(0.2), cc.animate(TeaLeftAnimation),cc.callFunc(function () {
          tea_filling = false;
          sprite_tea_left.attr({opacity:0});
          logic_state.filling_tea.boss = false;
          finish();
        })));
        setTimeout(function() {
          cc.audioEngine.playEffect(res_audio.audio_tea_filling); 
          fillTeaPart('boss');
        }, 1600);
      }
    }



    var frames_tea_player = [];
    for (var i = 0; i < 13; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_tea_player,cc.rect(i*90,0,90,129));
      frames_tea_player.push(sprite_frame);
    };
    var TeaPlayerAnimation = new cc.Animation(frames_tea_player, 0.15);
    TeaPlayerAnimation._frames[7].setDelayUnits(10);
    TeaPlayerAnimation._totalDelayUnits += 9;
    // console.log('TeaPlayerAnimation', TeaPlayerAnimation);
    var sprite_tea_player = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_tea_player,cc.rect(0,0,90,129)));
    sprite_tea_player.texture.setAliasTexParameters();
    sprite_tea_player.attr({x:544,y:234,opacity: 0});
    // sprite_tea_player.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_tea_player.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_tea_player.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_tea_player, 1);
    animate_tea_player = cc.animate(TeaPlayerAnimation);
    // sprite_tea_player.runAction(cc.repeatForever( cc.animate(TeaPlayerAnimation)));

    var frames_tea_boss = [];
    for (var i = 0; i < 13; i++) {
      var sprite_frame = new cc.SpriteFrame(res_img.sprite_tea_boss,cc.rect(i*117,0,117,140));
      // console.log(sprite_frame);
      frames_tea_boss.push(sprite_frame);
    };
    var TeaBossAnimation = new cc.Animation(frames_tea_boss, 0.15);
    TeaBossAnimation._frames[7].setDelayUnits(10);
    TeaBossAnimation._totalDelayUnits += 9;
    // console.log('TeaBossAnimation', TeaBossAnimation);
    var sprite_tea_boss = new cc.Sprite(new cc.SpriteFrame(res_img.sprite_tea_boss,cc.rect(0,0,117,140)));
    sprite_tea_boss.texture.setAliasTexParameters();
    sprite_tea_boss.attr({x:328,y:233,opacity: 0});
    // sprite_tea_boss.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_tea_boss.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_tea_boss.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_tea_boss, 1);
    animate_tea_boss = cc.animate(TeaBossAnimation);
    // sprite_tea_boss.runAction(cc.repeatForever( cc.animate(TeaBossAnimation)));\


    var teaIsTooHot = function () {
      input.blinkTea();
      cc.audioEngine.stopAllEffects();
      cc.audioEngine.playEffect(res_audio.audio_tea_unable);
      if(last_log._tea_is_too_hot) {
        return;
      }
      input.duringStart(true);
      var tea_string = logic.messages.tea_still_hot;
      if(logic_state.tea_countdown.player >= 3) {
        tea_string = logic.messages.tea_too_hot;
      }
      controller.director.log(tea_string, 'player', function () {
        input.duringEnd(true);
        this._tea_is_too_hot = true;
      });
    }

    var drinkTea = function (role, callback) {
      if(game_state.end) {
        return;
      }
      // input.duringStart();
      if(role == 'player') {
        if(logic_state.tea_countdown.player < 1) {
          // audio_tree.action_tea.play();
          cc.audioEngine.playEffect(res_audio.audio_action_tea, false);
          controller.director.log(logic.messages.drinking, 'player', function () {
            controller.director.hp('player', 'more');
          });
          sprite_tea_player.runAction(cc.sequence(animate_tea_player, cc.callFunc(function () {
            // input.duringEnd();
            controller.director.fill('player');
            logic_state.tea_countdown.player = 5;
            controller.director.step_action();
            if(callback) {
              callback();
            }
          })));
          setTimeout(function() {
            cc.audioEngine.playEffect(res_audio.audio_tea_drinking_1);
          }, 1250);
          setTimeout(function() {
            cc.audioEngine.playEffect(res_audio.audio_tea_knock_table);
          }, 3150);
        } else {
          if(callback) {
            callback();
          }
        }
      } else if(role == 'boss') {
        if(logic_state.tea_countdown.boss < 1) {
            controller.director.log(logic.messages.drinking, 'boss', function () {
              controller.director.hp('boss', 'more');
            });
          sprite_tea_boss.runAction(cc.sequence(animate_tea_boss, cc.callFunc(function () {
            // input.duringEnd();
            controller.director.fill('boss');
            logic_state.tea_countdown.boss = 5;
            controller.director.step_action();
            if(callback) {
              callback();
            }
          })));
          setTimeout(function() {
            cc.audioEngine.playEffect(res_audio.audio_tea_drinking_2);
          }, 1400);
          setTimeout(function() {
            cc.audioEngine.playEffect(res_audio.audio_tea_knock_table);
          }, 3150);
        } else {
          if(callback) {
            callback();
          }
        }
      } else {
        if(logic_state.tea_countdown.player < 1) {
          // audio_tree.action_tea.play();
          cc.audioEngine.playEffect(res_audio.audio_action_tea, false);
          controller.director.log(logic.messages.drinking, 'player', function () {
            controller.director.hp('player', 'more');
          });
          sprite_tea_player.runAction(cc.sequence(animate_tea_player, cc.callFunc(function () {
            logic_state.tea_countdown.player = 5;
            controller.director.fill('player');
            controller.director.step_action();
            drinkTea('boss', callback);
          })));
          setTimeout(function() {
            cc.audioEngine.playEffect(res_audio.audio_tea_drinking_1);
          }, 1250);
          setTimeout(function() {
            cc.audioEngine.playEffect(res_audio.audio_tea_knock_table);
          }, 3150);
        } else {
          drinkTea('boss', callback);
        }
      }
    }



    var isMessage = function (str) {
      for( index in logic.messages) {
        if(logic.messages[index] === str) {
          return true;
        }
      }
      return false
    }

    var delay_point_reg = /\[delay[0-9]*\]/;

    var mountain_delay = 3;

    var next_mountain = false;

    typeWriter = function (label, typeCallback, intervalCallback) {
      var whole_str = label.string;
      // var talk_delta = 30 + Math.floor(Math.random() * 60);
      // console.log(whole_str, label.string);
      label.string = '';

      var delay_points = [];

      while (whole_str.search(delay_point_reg) != -1) {
        delay_points.push({
          str_num: whole_str.search(delay_point_reg),
          delay: parseInt(whole_str.match(delay_point_reg)[0].replace(/\[delay/, ''))
        });
        whole_str = whole_str.replace(delay_point_reg, '');
      }

      whole_str = textLineBreak(whole_str);

      var get_delay = function (str_num) {
        var delay = 20 + Math.floor(Math.random() * 80);
        if(delay_points.length > 0 && delay_points[0].str_num == str_num) {
          delay = delay_points[0].delay;
          delay_points.shift();
        }
        if(debug_speed_up && !next_mountain) {
          delay = 10;
        }
        if(next_mountain) {
          delay = delay * mountain_delay;
          // console.log('mountain delay');
        }
        if(isMessage(whole_str)) {
          delay = 60;
        }
        // if(whole_str == logic.messages.mountain) {
        //   delay = 600;
        //   // console.log('mountain delay');
        // }
        // console.log(str_num, delay_points);
        return delay;
      }

      label.finish = function () {
        label.string = whole_str;
        clearTimeout(label.time_id);
        if(typeCallback) {
          typeCallback.call(label);
        }
      }

      type = function () {
        if(label.string.length < whole_str.length) {
          var target_num = label.string.length;
          label.string = whole_str.slice(0, target_num) + '_';
          label.time_id = setTimeout(type, get_delay(target_num));
          if(intervalCallback) {
            intervalCallback.call(label);
          }
        } else if(typeCallback) {
          label.string = whole_str;
          if(next_mountain) {
            musicFadeTo(1, 3000);
            effectFadeTo(0, 3000);
            setTimeout(function() {
              console.log(logic_state.mountained_id);
              cc.audioEngine.stopEffect(logic_state.mountained_id);
              cc.audioEngine.setEffectsVolume(1);
              typeCallback.call(label);
            }, 3400);
          } else {
            typeCallback.call(label);
          }
          if(whole_str == logic.messages.mountain) {
            next_mountain = true;
          } else {
            next_mountain = false;
          }
        }
      }
      type();
    }

    finishType = function () {
      for (var i = 0; i < labels.length; i++) {
        if(labels[i].finish) {
          labels[i].finish();
        }
      };
    }

    var log_node = new cc.Node();
    log_node.attr({
      x: controller.state.log_position.x,
      y: controller.state.log_position.y,
      height: controller.state.log_content_size.height,
      anchorX: 0,
      anchorY: 1,
      width: controller.state.log_content_size.width
    });
    this.addChild(log_node);
    var last_log = {};

    var log_labels = [];

    var log_update = function () {
      if(game_state.end) {
        log_clear();
      }
      var offset = 0;
      for (var i = 0; i < log_labels.length; i++) {
        var label = log_labels[i];
        if(label == false) {
          continue;
        }
        if(0 == i) {
          label.attr({opacity: 255});
          label.arraw_sprite.attr({opacity: 255});
        } else {
          label.attr({opacity: 128});
          label.arraw_sprite.attr({opacity: 128});
        }
        var label_height = label.getContentSize().height / 2;
        offset += label_height;
        // console.log(label_height, offset);
        if(typeof(label.should_offset) == 'undefined' || label.should_offset != offset) {
          if(label.move_action) {
            label.move_action.stop();
          }
          label.arraw_sprite.attr({y:label_height*2-16});
          if(label.game_role == 'player') {
            label.arraw_sprite.attr({x:controller.state.log_width * 2 + 10, rotation: 180});
            label.attr({x: controller.state.log_content_size.width - controller.state.log_width});
            label.move_action = label.runAction(cc.moveTo(0.2, cc.p(controller.state.log_content_size.width - controller.state.log_width, offset)));
          } else {
            label.arraw_sprite.attr({x:-10});
            label.move_action = label.runAction(cc.moveTo(0.2, cc.p(0, offset)));
          }
        }
        label.should_offset = offset;
        if (offset > controller.state.log_content_size.height) {
          label.runAction(cc.fadeOut(0.2));
          label.arraw_sprite.runAction(cc.fadeOut(0.2));
          log_labels[i] = false;
        }
      }
    }

    log_clear = function () {
      for (var i = 0; i < log_labels.length; i++) {
        var label = log_labels[i];
        if(label == false) {
          continue;
        }
        label.runAction(cc.fadeOut(0.2));
        label.arraw_sprite.runAction(cc.fadeOut(0.2));
        log_labels[i] = false;
      }
    }

    var logic_state = {
      current: {
        block: logic['start_block'],
        dialogue: 0 
      },
      tea_countdown: {
        player: 0,
        boss: 0
      },
      step: 0,
      filling_tea: {
        player: false,
        boss: false
      }
    };

    if(debug_speed_up) {
      logic_state.current.dialogue = logic_state.current.block.dialogues.length - 3;
    }

    if(debug_dialog !== false) {
      console.log('Logic debug enabled, id is ' + debug_dialog);
      logic_state.current.block = logic.random_pool[debug_dialog];
    }

    controller.director.log = function (str, role, callback) {
      if (typeof(str) != 'string') {
        return;
      }
      console.log(role + ': ' + str);
      var label = new cc.LabelTTF(str, 'Play', 22, cc.size(controller.state.log_width * 2,0));
      if(role === 'player') {
        label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
        label.game_role = 'player';
      } else {
        label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        label.game_role = 'boss';
      }
      label.setLineHeight(28);
      label.attr({
        anchorX: 0,
        anchorY: 1,
        scale: 0.5,
        color: cc.color(255,255,255,255)
      });
    
      var ArrawSunsetSprite = new cc.Sprite(res_img.sprite_arraw);
      ArrawSunsetSprite.texture.setAliasTexParameters();
      ArrawSunsetSprite.attr({scale: 2});
      label.addChild(ArrawSunsetSprite);
      label.arraw_sprite = ArrawSunsetSprite;

      log_node.addChild(label);
      last_log = label;
      log_labels.unshift(label);
      typeWriter(label, function () {
        if(callback) {
          callback.call(label);
        }
      }, log_update);
      log_update();
    }

    updateTeaPart = function () {
      if(!logic_state.filling_tea.player) {
        switchTeaPart('player', logic_state.tea_countdown.player);
      }
      if(!logic_state.filling_tea.boss) {
        switchTeaPart('boss', logic_state.tea_countdown.boss);
      }
    }

    fillTeaPart = function (role) {
      // logic_state.filling_tea[role] = true;
      var countdown = logic_state.tea_countdown[role];
      var current = 0;
      var fillInter = function () {
        // console.log('current',current,'countdown',countdown);
        if(countdown > current) {
          switchTeaPart(role, current);
          current+=1;
          setTimeout(function() {
            fillInter();
          }, 300);
        } else {
          // logic_state.filling_tea[role] = false;
        }
      }
      fillInter();
    }
    controller.fill_tea_part = fillTeaPart;

    controller.director.step_action = function () {
      if(controller.director.isFullHp() && Math.random() > 0.8) {
        controller.director.end();
        return;
      }
      logic_state.step ++;
      if(!logic_state.current.block.start_block || (logic_state.current.block.start_block && logic_state.current.dialogue == logic_state.current.block.dialogues.length) ) {
        logic_state.tea_countdown.player --;
        if(logic_state.tea_countdown.player < 1) {
          input.switchState('tea', true);
          // switchTeaPart('player', false);
        } else {
          input.switchState('tea', false);
          // switchTeaPart('player', logic_state.tea_countdown.player);
        }
        logic_state.tea_countdown.boss --;
        // if(logic_state.tea_countdown.boss < 1) {
        //   switchTeaPart('boss', false);
        // } else {
        //   switchTeaPart('boss', logic_state.tea_countdown.boss);
        // }
        updateTeaPart();
        // console.log('Tea count down: ', logic_state.tea_countdown);
      }
      if(logic_state.current.block.start_block && logic_state.current.dialogue == logic_state.current.block.dialogues.length) {
        input.switchState('talk', false);
      } else {
        input.switchState('talk', true);
      }
    }

    textPre = function (text) {
      var output = text;
      output = output.replace('{{total_seconds}}', TikTok.getSeconds());
      return output;
    }

    textLineBreak = function (text) {
      var output = text;
      for (var i = 80; i < output.length;) {
        if( i < 0) {
          break;
        }
        if(output[i] != ' ') {
          // console.log('no', i);
          i--;
        } else {
          // console.log('yes', i);
          output = output.slice(0, i) + '\n' + output.slice(i+1, output.length);
          i+=80;
        }
        // console.log('out', output);
      };
      return output;
    }

    var random_log = '';

    controller.director.next = function () {
      var pick = 0;
      do {
        if(random_log.match(/\[[0-9]*\]/g) && random_log.match(/\[[0-9]*\]/g).length > 8 ) {
          random_log = random_log.replace(/\[[0-9]*\]/, '');
        }
        pick = Math.floor(Math.random() * logic.random_pool.length);
        // console.log('try: ' + pick);
      } while(random_log.indexOf('[' + pick + ']') !== -1);
      random_log = random_log + '[' + pick + ']';
      // console.log(random_log, pick, logic.random_pool.length);
      logic_state.current.block = logic.random_pool[pick];
      logic_state.current.dialogue = 0;
    }

    controller.director.talk = function (force, mountain) {
      if(game_state.end) {
        return;
      }
      if((controller.talking || !input.talk) && !force) {
        // console.log('Talk fail, talking: ', controller.talking, ', talk state: ', input.talk);
        return;
      }
      var boss_delay = 1200 + Math.floor(Math.random() * 1200);
      if(debug_speed_up) {
        boss_delay = 0;
      }
      if(logic_state.step == 0) {
        var event = new cc.EventCustom("key_pressed");
        cc.eventManager.dispatchEvent(event);
      }
      if(logic_state.current.dialogue < logic_state.current.block.dialogues.length) {
        var current_dialogue = logic_state.current.block.dialogues[logic_state.current.dialogue];
        var original_text = current_dialogue.text;
        var current_text = textPre(original_text);
        // console.log(current_dialogue);
        // if(controller.talking) {
        //   finishType();
        //   return;
        // }
        input.duringStart();
        if(current_dialogue.role == 'player') {
          // audio_tree.action_talk.play();
          cc.audioEngine.playEffect(res_audio.audio_action_talk, false);
        }
        controller.director.log(current_text, current_dialogue.role, function () {
          // console.log();
          if(current_dialogue.role == 'player' && logic_state.current.dialogue < logic_state.current.block.dialogues.length) {
            setTimeout(function() {
              controller.director.step_action();
              input.duringEnd(true);
              controller.director.talk();
            }, boss_delay);
          } else {
            controller.director.step_action();
            input.duringEnd();
          }
          if(current_dialogue.total_listen) {
            var target_label = this;
            var count = 0;
            var delay = 4;
            var played = false;
            var callback = function () {
              delay = Math.floor(delay * 1.4);
              var current_sec = TikTok.getSeconds().toString()
              if(count > (TikTok.getSeconds() + 1) * 35 && !played) {
                delay = 1000;
                played = true;
              } else {
                count ++;
                delay = 5 + Math.floor(Math.random() * 30);
              }
              if(delay !== 1000) {
                var placeholder = '';
                for (var i = 0; i < current_sec.length; i++) {
                  if(count < (i + 1) * 35) {
                    placeholder = placeholder + Math.floor(Math.random() * 10).toString();
                  } else {
                    placeholder = placeholder + current_sec[i];
                  }
                };
                target_label.string = original_text.replace(/\[delay[0-9]*\]/g, '').replace('{{total_seconds}}', placeholder);
              } else {
                target_label.string = textPre(original_text.replace(/\[delay[0-9]*\]/g, ''));
              }
              setTimeout(callback, delay);
            }
            callback();
          }
        });
        logic_state.current.dialogue++;
      } else {
        input.duringStart();
        controller.director.next();
        var popcorn_pick = Math.floor(Math.random()*logic.popcorn_pool.length);
        if(!mountain) {
          cc.audioEngine.playEffect(res_audio.audio_action_talk, false);
          controller.director.log(logic.popcorn_pool[popcorn_pick], 'player', function () {
            setTimeout(function() {
              drinkTea('boss', function () {
                input.duringEnd(true);
                controller.director.talk(true);
              });
            }, boss_delay);
          });
        } else {
          input.duringEnd(true);
          controller.director.talk(true);
        }
        // controller.director.tea(true);
      }
    }

    controller.director.tea = function () {
      if(controller.talking) {
        return;
      }
      if(!input.tea) {
        if(logic_state.tea_countdown.player > 0) {
          teaIsTooHot();
        }
        return;
      }
      // logic_state.tea_countdown = 3;
      // console.log(logic_state);
      if(logic_state.current.dialogue == logic_state.current.block.dialogues.length) {
        input.duringStart();
        drinkTea('player', function () {
          controller.director.next();
          input.duringEnd(true);
          controller.director.talk(true);
        });
      } else {
        controller.director.next();
        input.duringStart();
        // debugger;
        drinkTea('both', function () {
          input.duringEnd(true);
          controller.director.talk(true);
        });
      }
    }

    var LikeNode = new cc.Node();
    LikeNode.attr({x:564, y: 304, opacity: 0});
    LikeNode.setCascadeOpacityEnabled(true);
    self.addChild(LikeNode);

    var LikeSprite = new cc.Sprite(res_img.sprite_like);
    LikeSprite.texture.setAliasTexParameters();
    LikeNode.addChild(LikeSprite);

    var like_count = 0;

    var LikeCountText = new cc.LabelTTF('+1', 'Lato', 22);
    LikeCountText.attr({x: 11.5, y: -1.5, scale: 0.5, color: cc.color(0,0,0), anchorX: 0});
    LikeCountText.texture.setAliasTexParameters();
    LikeNode.addChild(LikeCountText);

    controller.director.like = function () {
      like_count++;
      // LikeNode.stopAllEffects();
      LikeCountText.setString('+' + like_count);
      LikeNode.attr({x:564, y: 304, opacity: 0});
      LikeNode.runAction(cc.sequence(cc.fadeIn(1.8), cc.delayTime(2.5), cc.fadeOut(0.5)));
      LikeNode.runAction(cc.moveTo(1.8, cc.p(564, 334)).easing(cc.easeIn(0.8)));
    }

    controller.director.mountain = function () {
      if(controller.talking) {
        return;
      }
      if(!input.mountain) {
        return;
      }
      input.duringStart();
      var boss_delay = 1200 + Math.floor(Math.random() * 1200);
      // cc.audioEngine.playEffect(res_audio.audio_action_mountain, false);
      audio_tree.action_mountain.play();
      controller.director.like();
      controller.director.log(logic.messages.mountain, 'player', function () {
        logic_state.current.dialogue++;
        controller.director.step_action();
        musicFadeTo(0, 2000);
        effectFadeTo(0.8, 2000, 0);
        logic_state.mountained_id = cc.audioEngine.playEffect(res_audio.audio_ambient_mountained, true);
        setTimeout(function() {
          controller.director.talk(true, true);
        }, boss_delay);
        mountain_delay = mountain_delay * 1.5;
      });
    }

    var game_start_listener = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "game_start",
        callback: function(event){
          input.switchState('talk', true);
        }
    }, this);
    cc.eventManager.addListener(game_start_listener, 1);

    return true;
  }
});



var EveningScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.addChild(new BackgroundLayer(), 1);
        this.addChild(new WaterLayer(), 3);
        this.addChild(new SunLayer(), 4);
        this.addChild(new IslandsLayer(), 5);
        this.addChild(new GroundLayer(), 5);
        // this.addChild(new RoleLayer(), 50);
        // this.addChild(new BossLayer(), 50);
        this.addChild(new IdleLayer(), 50);
        this.addChild(new TitleLayer(), 90);
        this.addChild(new UiLayer(), 90);
        this.addChild(new DustLayer(), 92);
        this.addChild(new ControllerLayer(), 95);
        this.addChild(new LogicLayer(), 96);
        this.addChild(new SunlightLayer(), 99);
        pressstart_layer = new PressstartLayer();
        this.addChild(pressstart_layer, 100);
        if(debug_scene){
          pressstart_layer.blow();
          var event = new cc.EventCustom("pressstart_gone");
          cc.eventManager.dispatchEvent(event);
          game_state.state = 2;
          TikTok.init();
        }
    }
});

