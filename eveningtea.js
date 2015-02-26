
var debug_scene = true;

var debug_speed_up = true;

var debug_dialog = false;

var game_state = {
  state: 0,
  role: {
    speed: 0,
    vector: 0
  }
};

var controller = {
  state: {
    log_position: cc.p(170, 75),
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

var ControllerLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();

    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed: function (key) {
        if(game_state.state > 1) {
          if( 88 == key){
            var event = new cc.EventCustom("start_shoot");
            cc.eventManager.dispatchEvent(event);
          }
          if(key == cc.KEY.left) {
            game_state.role.vector = -10;
          }
          if(key == cc.KEY.right) {
            game_state.role.vector = 10;
          }
        }
      },
      onKeyReleased: function (key) {
        if(game_state.state > 1) {
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
    
    var BackgroundSunsetSprite = new cc.Sprite(res.sprite_background_sunset);
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

    var PromptSprite = new cc.Sprite(res.sprite_pressstart);
    PromptSprite.texture.setAliasTexParameters();
    PromptSprite.attr({
      x: 450,
      y: 70,
      color: cc.color(255,255,255)
    });
    this.addChild(PromptSprite, 1);
    var blink = cc.blink(2,1);
    // console.log(blink);
    PromptSprite.runAction(cc.repeatForever(blink));

    var PressBgLSprite = new cc.Sprite(res.sprite_press_bg);
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

    var PressBgRSprite = new cc.Sprite(res.sprite_press_bg);
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


    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed: function (key) {
        if(88 === key && is_gone != true) {
          is_gone = true;
          self.runAction(cc.sequence(cc.fadeOut(2), cc.callFunc(function () {
            this.parent.removeChild(this);
          }, self)));
          // console.log(cc.moveTo(2, cc.p(-450, 0)));
          PressBgLSprite.runAction(cc.moveTo(1, cc.p(-450, 0)).easing(cc.easeIn(3.0)) );
          PressBgRSprite.runAction(cc.moveTo(1, cc.p(900, 0)).easing(cc.easeIn(3.0)) );
          self.runAction(cc.sequence(cc.delayTime(0.7), cc.callFunc(function () {
            var event = new cc.EventCustom("pressstart_gone");
            cc.eventManager.dispatchEvent(event);
            game_state.state = 1;
            TikTok.init();
          }, self)));
          self.removeChild(PromptSprite);
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
    var TitleSprite = new cc.Sprite(res.sprite_words_title);
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
    var UiLeftSprite = new cc.Sprite(res.sprite_ui_left);
    var UiRightSprite = new cc.Sprite(res.sprite_ui_right);
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

    var UiShootSprite = new cc.Sprite(res.sprite_ui_shoot);
    UiShootSprite.texture.setAliasTexParameters();
    UiShootSprite.attr({
      x: 800,
      y: 240,
      opacity: 0
    });
    this.addChild(UiShootSprite);

    var UiHpPlayerSprite =  new cc.Sprite(res.sprite_ui_hp);
    UiHpPlayerSprite.texture.setAliasTexParameters();
    UiHpPlayerSprite.attr({
      x: 830.5,
      y: 38.5,
      opacity: 0,
      anchorX: 1,
      anchorY: 0
    });
    UiHpPlayerSprite.runAction(cc.scaleTo(0.1, 0.35, 1));
    this.addChild(UiHpPlayerSprite, 20);
    var UiHpBackPlayerSprite =  new cc.Sprite(res.sprite_ui_hp);
    UiHpBackPlayerSprite.texture.setAliasTexParameters();
    UiHpBackPlayerSprite.attr({
      x: 830.5,
      y: 38.5,
      opacity: 255,
      anchorX: 1,
      anchorY: 0,
      color: cc.color(64, 64, 64, 255)
    });
    UiHpBackPlayerSprite.runAction(cc.scaleTo(0.1, 0.35, 1));
    this.addChild(UiHpBackPlayerSprite, 10);

    var UiHpBossSprite =  new cc.Sprite(res.sprite_ui_hp);
    UiHpBossSprite.texture.setAliasTexParameters();
    UiHpBossSprite.attr({
      x: 68.5,
      y: 38.5,
      opacity: 0,
      anchorX: 0,
      anchorY: 0
    });
    UiHpBossSprite.runAction(cc.scaleTo(0.1, 0.65, 1));
    this.addChild(UiHpBossSprite, 20);
    var UiHpBackBossSprite =  new cc.Sprite(res.sprite_ui_hp);
    UiHpBackBossSprite.texture.setAliasTexParameters();
    UiHpBackBossSprite.attr({
      x: 68.5,
      y: 38.5,
      opacity: 255,
      anchorX: 0,
      anchorY: 0,
      color: cc.color(64, 64, 64, 255)
    });
    UiHpBackBossSprite.runAction(cc.scaleTo(0.1, 0.65, 1));
    this.addChild(UiHpBackBossSprite, 10);

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
      if('player' == role) {
        target = UiHpPlayerSprite;
        target_back = UiHpBackPlayerSprite;
      } else if('boss' == role) {
        target = UiHpBossSprite;
        target_back = UiHpBackBossSprite;
      } else {
        return;
      }
      var target_size = target.getScaleX() + offset;
      if(target_size >= 1) {
        target_size = 1;
        if(target.getScaleX() == 1) {
          return;
        }
      } else if(target_size < 0) {
        target_size = 0;
      }
      if(target_size >= 0.6 && target == UiHpPlayerSprite) {
        controller.input.switchState('mountain', true);
      }
      target.runAction(cc.sequence(cc.blink(0.8, 4), cc.delayTime(0.5), cc.scaleTo(1.7, target_size, 1)));
      target_back.runAction(cc.sequence(cc.blink(0.8, 4), cc.scaleTo(0.2, target_size, 1)));
    }

    var UiBossBullets = [];
    for (var i = 0; i < 0; i++) {
      var bullet =  new cc.Sprite(res.sprite_ui_bullet);
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
      var bullet =  new cc.Sprite(res.sprite_ui_bullet);
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

    this.role_sprite = new cc.Sprite(res.sprite_role);
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
      var sprite_frame = new cc.SpriteFrame(res.sprite_sun,cc.rect(i*237,0,237,68));
      frames.push(sprite_frame);
    };
    var SunAnimation = new cc.Animation(frames, 0.2);
    console.log('SunAnimation', SunAnimation);
    var sprite_sun = new cc.Sprite(new cc.SpriteFrame(res.sprite_sun,cc.rect(0,0,237,68)));
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


    var sprite_sunlight = new cc.Sprite(res.sprite_sunlight);
    // sprite_sunlight.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    // sprite_sunlight.setBlendFunc(gl.SRC_ALPHA, gl.DST_COLOR);
    // sprite_sunlight.setBlendFunc(gl.DST_COLOR, gl.ONE);
    sprite_sunlight.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    sprite_sunlight.attr({x:390,y:200});
    var sunlight_animation = function () {
      var light = 235 + 20 * Math.random();
      // console.log(light);
      this.runAction(
        cc.sequence(
          cc.fadeTo(0.4,light),cc.delayTime(0.8),
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


    sprite_mountain = new cc.Sprite(res.sprite_mountain);
    sprite_mountain.attr({
      x: 497,
      y: 310,
      opacity: 0
    });
    this.addChild(sprite_mountain, 0);

    controller.director.showMountain = function () {
      sprite_mountain.runAction(cc.fadeIn(2));
    }


    var sprite_islands = new cc.Sprite(res.sprite_island);
    sprite_islands.texture.setAliasTexParameters();
    // sprite_islands.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    sprite_islands.attr({x:450,y:238});
    this.addChild(sprite_islands, 10);

    var frames_ref1 = [];
    for (var i = 0; i < 8; i++) {
      var sprite_frame = new cc.SpriteFrame(res.sprite_ref1,cc.rect(i*127,0,127,48));
      frames_ref1.push(sprite_frame);
    };
    var Ref1Animation = new cc.Animation(frames_ref1, 0.2);
    // console.log('Ref1Animation', Ref1Animation);
    var sprite_ref1 = new cc.Sprite(new cc.SpriteFrame(res.sprite_ref1,cc.rect(0,0,127,48)));
    sprite_ref1.attr({x:58,y:223, opacity: 170});
    sprite_ref1.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_ref1.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_ref1.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_ref1, 1);
    sprite_ref1.runAction(cc.repeatForever( cc.animate(Ref1Animation)));

    var frames_ref2 = [];
    for (var i = 0; i < 8; i++) {
      var sprite_frame = new cc.SpriteFrame(res.sprite_ref2,cc.rect(0,i*65,368,65));
      frames_ref2.push(sprite_frame);
    };
    var Ref2Animation = new cc.Animation(frames_ref2, 0.2);
    console.log('Ref2Animation', Ref2Animation);
    var sprite_ref2 = new cc.Sprite(new cc.SpriteFrame(res.sprite_ref2,cc.rect(0,0,368,65)));
    sprite_ref2.texture.setAliasTexParameters();
    sprite_ref2.attr({x:577,y:220, opacity: 170});
    sprite_ref2.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_ref2.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_ref2.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_ref2, 1);
    sprite_ref2.runAction(cc.repeatForever( cc.animate(Ref2Animation)));

    var frames_ref3 = [];
    for (var i = 0; i < 8; i++) {
      var sprite_frame = new cc.SpriteFrame(res.sprite_ref3,cc.rect(i*101,0,101,65));
      frames_ref3.push(sprite_frame);
    };
    var Ref3Animation = new cc.Animation(frames_ref3, 0.2);
    console.log('Ref3Animation', Ref3Animation);
    var sprite_ref3 = new cc.Sprite(new cc.SpriteFrame(res.sprite_ref3,cc.rect(0,0,101,65)));
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

    var DustPart = new cc.ParticleSystem(res.p_dust);
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
      if(Math.random() > 0.9) {
        this.attr({scaleY: 3+Math.random()*7, scaleX: 1});
      } else {
        this.attr({scaleX: 10+Math.random()*47, scaleY: 1});
      }
      this.runAction(cc.sequence(cc.fadeIn(animation_time), cc.fadeOut(animation_time), cc.callFunc(function  (argument) {
        lights_call.apply(this);
      }, this)));
    }

    for (var i = 0; i < 160; i++) {
      var SpriteLight = new cc.Sprite(res.sprite_light);
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

    var GrassSprite = new cc.Sprite(res.sprite_grass);
    GrassSprite.attr({x: 451, y: 159});
    GrassSprite.texture.setAliasTexParameters();
    this.addChild(GrassSprite);

    var Weapon1Sprite = new cc.Sprite(res.sprite_weapon1);
    Weapon1Sprite.attr({x: 865, y: 184});
    Weapon1Sprite.texture.setAliasTexParameters();
    this.addChild(Weapon1Sprite, 1);

    var Weapon2Sprite = new cc.Sprite(res.sprite_weapon2);
    Weapon2Sprite.attr({x: 227, y: 191});
    Weapon2Sprite.texture.setAliasTexParameters();
    this.addChild(Weapon2Sprite, 1);

    var TableSprite = new cc.Sprite(res.sprite_table);
    TableSprite.attr({x: 437, y: 180});
    TableSprite.texture.setAliasTexParameters();
    this.addChild(TableSprite, 1);


    var frames_fire = [];
    for (var i = 0; i < 8; i++) {
      var sprite_frame = new cc.SpriteFrame(res.sprite_fire,cc.rect(0,i*148,227,148));
      frames_fire.push(sprite_frame);
    };
    var FireAnimation = new cc.Animation(frames_fire, 0.13);
    console.log('FireAnimation', FireAnimation);
    var sprite_fire = new cc.Sprite(new cc.SpriteFrame(res.sprite_fire,cc.rect(0,0,227,148)));
    sprite_fire.texture.setAliasTexParameters();
    sprite_fire.attr({x:725,y:151});
    // sprite_fire.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_fire.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_fire.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_fire, 1);
    sprite_fire.runAction(cc.repeatForever( cc.animate(FireAnimation)));

    var frames_katana = [];
    for (var i = 0; i < 4; i++) {
      var sprite_frame = new cc.SpriteFrame(res.sprite_katana,cc.rect(i*76,0,76,185));
      frames_katana.push(sprite_frame);
    };
    var KatanaAnimation = new cc.Animation(frames_katana, 0.18);
    console.log('KatanaAnimation', KatanaAnimation);
    var sprite_katana = new cc.Sprite(new cc.SpriteFrame(res.sprite_katana,cc.rect(0,0,76,185)));
    sprite_katana.texture.setAliasTexParameters();
    sprite_katana.attr({x:805,y:186});
    // sprite_katana.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_katana.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_katana.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_katana, 1);
    sprite_katana.runAction(cc.repeatForever( cc.animate(KatanaAnimation)));

    var frames_spear = [];
    for (var i = 0; i < 4; i++) {
      var sprite_frame = new cc.SpriteFrame(res.sprite_spear,cc.rect(i*78,0,78,318));
      frames_spear.push(sprite_frame);
    };
    var SpearAnimation = new cc.Animation(frames_spear, 0.18);
    console.log('SpearAnimation', SpearAnimation);
    var sprite_spear = new cc.Sprite(new cc.SpriteFrame(res.sprite_spear,cc.rect(0,0,78,318)));
    sprite_spear.texture.setAliasTexParameters();
    sprite_spear.attr({x:70,y:239});
    // sprite_spear.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_spear.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_spear.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_spear, 1);
    sprite_spear.runAction(cc.repeatForever( cc.animate(SpearAnimation)));

    return true;
  }
});

var IdleLayer = cc.Layer.extend({
  sprite:null,
  ctor: function () {
    self = this;
    this._super();

    // var TeapotSprite = new cc.Sprite(res.sprite_teapot);
    // TeapotSprite.attr({x: 442, y: 219, opacity: 0});
    // TeapotSprite.texture.setAliasTexParameters();
    // this.addChild(TeapotSprite, 1);

    var frames_player = [];
    for (var i = 0; i < 12; i++) {
      var sprite_frame = new cc.SpriteFrame(res.sprite_player,cc.rect(i*165,0,165,223));
      frames_player.push(sprite_frame);
    };
    var PlayerAnimation = new cc.Animation(frames_player, 0.18);
    console.log('PlayerAnimation', PlayerAnimation);
    var sprite_player = new cc.Sprite(new cc.SpriteFrame(res.sprite_player,cc.rect(0,0,165,223)));
    sprite_player.texture.setAliasTexParameters();
    sprite_player.attr({x:552,y:213});
    // sprite_player.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_player.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_player.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_player, 1);
    sprite_player.runAction(cc.repeatForever( cc.animate(PlayerAnimation)));

    var frames_boss = [];
    for (var i = 0; i < 12; i++) {
      var sprite_frame = new cc.SpriteFrame(res.sprite_boss,cc.rect(i*162,0,162,203));
      frames_boss.push(sprite_frame);
    };
    var BossAnimation = new cc.Animation(frames_boss, 0.18);
    console.log('BossAnimation', BossAnimation);
    var sprite_boss = new cc.Sprite(new cc.SpriteFrame(res.sprite_boss,cc.rect(0,0,162,203)));
    sprite_boss.texture.setAliasTexParameters();
    sprite_boss.attr({x:342,y:207});
    // sprite_boss.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_boss.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_boss.setBlendFunc(gl.ONE, gl.ONE);
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
      switchState: function (target, state) {
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
                  input.tea_inited = true;
                }
                input.tea = true;
                break;
              case 'talk':
                if(!controller.talking) {
                  input.sprite_ui_talk.runAction(cc.fadeIn(0.1));
                }
                input.talk = true;
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
        if(!only_logic) {
          if(input.sprite_ui_tea.fade_in_action) {
            input.sprite_ui_tea.fade_in_action.stop();
          }
          input.sprite_ui_tea.runAction(cc.fadeOut(0.1));
          if(input.sprite_ui_talk.fade_in_action) {
            input.sprite_ui_talk.fade_in_action.stop();
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
      }
    };
    controller.input = input;

    input.sprite_ui_tea = new cc.Sprite(res.sprite_ui_tea);
    input.sprite_ui_tea.attr({
      x: 615,
      y: 220,
      anchorX: 0,
      opacity: 0
    });
    this.addChild(input.sprite_ui_tea);

    input.sprite_ui_talk = new cc.Sprite(res.sprite_ui_talk);
    input.sprite_ui_talk.attr({
      x: 615,
      y: 240,
      anchorX: 0,
      opacity: 0
    });
    this.addChild(input.sprite_ui_talk);

    input.sprite_ui_mountain = new cc.Sprite(res.sprite_ui_mountain);
    input.sprite_ui_mountain.attr({
      x: 615,
      y: 200,
      anchorX: 0,
      opacity: 0
    });
    this.addChild(input.sprite_ui_mountain);


    var TeapotSprite = new cc.Sprite(res.sprite_teapot);
    TeapotSprite.attr({x: 442, y: 219, opacity: 0});
    TeapotSprite.texture.setAliasTexParameters();
    this.addChild(TeapotSprite, 1);

    var TeaPlayerStartSprite = new cc.Sprite(res.sprite_tea_player_start);
    TeaPlayerStartSprite.attr({x:544,y:234});
    TeaPlayerStartSprite.texture.setAliasTexParameters();
    this.addChild(TeaPlayerStartSprite, 1);


    var TeaPlayerPart = new cc.ParticleSystem(res.p_tea);
    TeaPlayerPart.setStartColor(cc.color(255, 255, 255, 200));
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
    var TeaBossPart = new cc.ParticleSystem(res.p_tea);
    TeaBossPart.setStartColor(cc.color(255, 255, 255, 200));
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
      if(state) {
        if(role == 'player') {
          TeaPlayerPart.setEmissionRate(state);
        } else {
          TeaBossPart.setEmissionRate(state);
        }
      } else {
        if(role == 'player') {
          TeaPlayerPart.setEmissionRate(0);
        } else {
          TeaBossPart.setEmissionRate(0);
        }
      }
    }

    var frames_tea_player = [];
    for (var i = 0; i < 13; i++) {
      var sprite_frame = new cc.SpriteFrame(res.sprite_tea_player,cc.rect(i*90,0,90,129));
      frames_tea_player.push(sprite_frame);
    };
    var TeaPlayerAnimation = new cc.Animation(frames_tea_player, 0.15);
    TeaPlayerAnimation._frames[7].setDelayUnits(10);
    TeaPlayerAnimation._totalDelayUnits += 9;
    console.log('TeaPlayerAnimation', TeaPlayerAnimation);
    var sprite_tea_player = new cc.Sprite(new cc.SpriteFrame(res.sprite_tea_player,cc.rect(0,0,90,129)));
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
      var sprite_frame = new cc.SpriteFrame(res.sprite_tea_boss,cc.rect(i*117,0,117,140));
      // console.log(sprite_frame);
      frames_tea_boss.push(sprite_frame);
    };
    var TeaBossAnimation = new cc.Animation(frames_tea_boss, 0.15);
    TeaBossAnimation._frames[7].setDelayUnits(10);
    TeaBossAnimation._totalDelayUnits += 9;
    console.log('TeaBossAnimation', TeaBossAnimation);
    var sprite_tea_boss = new cc.Sprite(new cc.SpriteFrame(res.sprite_tea_boss,cc.rect(0,0,117,140)));
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
      if(last_log._tea_is_too_hot) {
        return;
      }
      input.duringStart(true);
      controller.director.log('[Tea is too hot]', 'player', function () {
        input.duringEnd(true);
        this._tea_is_too_hot = true;
      });
    }

    var drinkTea = function (role, callback) {
      // input.duringStart();
      if(role == 'player') {
        if(logic_state.tea_countdown.player < 1) {
          controller.director.log('[Drinking tea]', 'player', function () {
            controller.director.hp('player', 'more');
          });
          sprite_tea_player.runAction(cc.sequence(animate_tea_player, cc.callFunc(function () {
            // input.duringEnd();
            logic_state.tea_countdown.player = 4;
            controller.director.step_action();
            if(callback) {
              callback();
            }
          })));
        } else {
          if(callback) {
            callback();
          }
        }
      } else if(role == 'boss') {
        if(logic_state.tea_countdown.boss < 1) {
            controller.director.log('[Drinking tea]', 'boss', function () {
              controller.director.hp('boss', 'more');
            });
          sprite_tea_boss.runAction(cc.sequence(animate_tea_boss, cc.callFunc(function () {
            // input.duringEnd();
            logic_state.tea_countdown.boss = 4;
            controller.director.step_action();
            if(callback) {
              callback();
            }
          })));
        } else {
          if(callback) {
            callback();
          }
        }
      } else {
        if(logic_state.tea_countdown.player < 1) {
          controller.director.log('[Drinking tea]', 'player', function () {
            controller.director.hp('player', 'more');
          });
          sprite_tea_player.runAction(cc.sequence(animate_tea_player, cc.callFunc(function () {
            logic_state.tea_countdown.player = 4;
            controller.director.step_action();
            drinkTea('boss', callback);
          })));
        } else {
          drinkTea('boss', callback);
        }
      }
    }




    var frames_fire = [];
    for (var i = 0; i < 8; i++) {
      var sprite_frame = new cc.SpriteFrame(res.sprite_fire,cc.rect(0,i*148,227,148));
      frames_fire.push(sprite_frame);
    };
    var FireAnimation = new cc.Animation(frames_fire, 0.13);
    console.log('FireAnimation', FireAnimation);
    var sprite_fire = new cc.Sprite(new cc.SpriteFrame(res.sprite_fire,cc.rect(0,0,227,148)));
    sprite_fire.texture.setAliasTexParameters();
    sprite_fire.attr({x:725,y:151});
    // sprite_fire.setBlendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
    // sprite_fire.setBlendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
    // sprite_fire.setBlendFunc(gl.ONE, gl.ONE);
    this.addChild(sprite_fire, 1);
    sprite_fire.runAction(cc.repeatForever( cc.animate(FireAnimation)));




    var delay_point_reg = /\[delay[0-9]*\]/;

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
        if(debug_speed_up) {
          delay = 10;
        }
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
          typeCallback.call(label);
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
      var offset = 0;
      for (var i = 0; i < log_labels.length; i++) {
        var label = log_labels[i];
        if(label == false) {
          continue;
        }
        if(0 == i) {
          label.attr({opacity: 255});
        } else {
          label.attr({opacity: 128});
        }
        var label_height = label.getContentSize().height / 2;
        offset += label_height;
        // console.log(label_height, offset);
        if(typeof(label.should_offset) == 'undefined' || label.should_offset != offset) {
          if(label.move_action) {
            label.move_action.stop();
          }
          if(label.game_role == 'player') {
            label.attr({x: controller.state.log_content_size.width - controller.state.log_width});
            label.move_action = label.runAction(cc.moveTo(0.2, cc.p(controller.state.log_content_size.width - controller.state.log_width, offset)));
          } else {
            label.move_action = label.runAction(cc.moveTo(0.2, cc.p(0, offset)));
          }
        }
        label.should_offset = offset;
        if (offset > controller.state.log_content_size.height) {
          label.runAction(cc.fadeOut(0.2));
          log_labels[i] = false;
        }
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
      step: 0
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

    controller.director.step_action = function () {
      logic_state.step ++;
      if(!logic_state.current.block.start_block || (logic_state.current.block.start_block && logic_state.current.dialogue == logic_state.current.block.dialogues.length) ) {
        logic_state.tea_countdown.player --;
        if(logic_state.tea_countdown.player < 1) {
          input.switchState('tea', true);
          switchTeaPart('player', false);
        } else {
          input.switchState('tea', false);
          switchTeaPart('player', logic_state.tea_countdown.player * 10);
        }
        logic_state.tea_countdown.boss --;
        if(logic_state.tea_countdown.boss < 1) {
          switchTeaPart('boss', false);
        } else {
          switchTeaPart('boss', logic_state.tea_countdown.boss * 10);
        }
        console.log(logic_state.tea_countdown);
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
      for (var i = 90; i < output.length;) {
        if( i < 0) {
          break;
        }
        if(output[i] != ' ') {
          console.log('no', i);
          i--;
        } else {
          console.log('yes', i);
          output = output.slice(0, i) + '\n' + output.slice(i+1, output.length);
          i+=90;
        }
        console.log('out', output);
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

    controller.director.talk = function (force) {
      if((controller.talking || !input.talk) && !force) {
        console.log('Talk fail, talking: ', controller.talking, ', talk state: ', input.talk);
        return;
      }
      var boss_delay = 800 + Math.floor(Math.random() * 1200);
      if(debug_speed_up) {
        boss_delay = 0;
      }
      if(logic_state.step == 0) {
        var event = new cc.EventCustom("key_pressed");
        cc.eventManager.dispatchEvent(event);
      }
      if(logic_state.current.dialogue < logic_state.current.block.dialogues.length) {
        current_dialogue = logic_state.current.block.dialogues[logic_state.current.dialogue];
        current_text = textPre(current_dialogue.text);
        // console.log(current_dialogue);
        // if(controller.talking) {
        //   finishType();
        //   return;
        // }
        input.duringStart();
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
        });
        logic_state.current.dialogue++;
      } else {
        input.duringStart();
        controller.director.next();
        var popcorn_pick = Math.floor(Math.random()*logic.popcorn_pool.length);
        controller.director.log(logic.popcorn_pool[popcorn_pick], 'player', function () {
          setTimeout(function() {
            drinkTea('boss', function () {
              input.duringEnd(true);
              controller.director.talk(true);
            });
          }, boss_delay);
        });
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

    controller.director.mountain = function () {
      if(controller.talking) {
        return;
      }
      if(!input.mountain) {
        return;
      }
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
        if(!debug_scene) {
          this.addChild(new PressstartLayer(), 100);
        } else {
          var event = new cc.EventCustom("pressstart_gone");
          cc.eventManager.dispatchEvent(event);
          game_state.state = 2;
          TikTok.init();
        }
    }
});

