(function(window){

  // Audio res list

  // Audio res
  var res_opening = 'res/audio/opening';
  var res_ambient = 'res/audio/ambient';
  var res_action_talk = 'res/audio/action_talk';
  var res_action_tea = 'res/audio/action_tea';


  // Audio res for test
  var res_audio_access = 'res/audio/test/access';
  var res_audio_quiet = 'res/audio/test/quiet';
  var res_audio_victory = 'res/audio/test/victory';
  var res_audio_tank = 'res/audio/test/tank';

  // Audio using
  var audio_using = {
    background: {
      res: res_ambient,
      volume: 100,
      repeat: true
    },
    curtain: {
      res: res_opening,
      volume: 100,
      repeat: false
    },
    action_talk: {
      res: res_action_talk,
      volume: 100,
      repeat: false
    },
    action_tea: {
      res: res_action_tea,
      volume: 100,
      repeat: false
    },
    action_mountain: {
      res: res_action_talk,
      volume: 100,
      repeat: false
    },
    mountaining: {
      res: res_action_talk,
      volume: 100,
      repeat: false
    },
    drinking: {
      res: null,
      volume: 100,
      repeat: false
    },
    drinking_end: {
      res: null,
      volume: 100,
      repeat: false
    },
    teapot_show: {
      res: null,
      volume: 100,
      repeat: false
    },
    mountain_show: {
      res: null,
      volume: 100,
      repeat: false
    },
    ammo_show: {
      res: null,
      volume: 100,
      repeat: false
    },
    tea_filling: {
      res: null,
      volume: 100,
      repeat: false
    }
  };

  var audio_tree = {
    _audio_using: audio_using
  };

  for(index in audio_using) {
    var audio_current = audio_using[index];
    var audio_instance;
    audio_instance = new buzz.sound(audio_current.res, {
      formats: ['ogg', 'mp3'],
      preload: true,
      loop: audio_current.repeat,
      volume: audio_current.volume
    });
    audio_instance._start_volume = audio_current.volume;
    audio_tree[index] = audio_instance;
  } 

  window.audio_tree = audio_tree;

})(window);