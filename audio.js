(function(window){

  // Audio res list

  // Audio res

  // Audio res for test
  var res_audio_access = 'res/audio/test/access';
  var res_audio_quiet = 'res/audio/test/quiet';
  var res_audio_victory = 'res/audio/test/victory';
  var res_audio_tank = 'res/audio/test/tank';

  // Audio using
  var audio_using = {
    background: {
      res: res_audio_quiet,
      volume: 80,
      repeat: true
    },
    curtain: {
      res: res_audio_victory,
      volume: 20,
      repeat: false
    },
    action_talk: {
      res: res_audio_tank,
      volume: 20,
      repeat: false
    },
    action_tea: {
      res: res_audio_tank,
      volume: 20,
      repeat: false
    },
    action_mountain: {
      res: res_audio_tank,
      volume: 20,
      repeat: false
    },
    mountaining: {
      res: res_audio_tank,
      volume: 20,
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
      formats: ['mp3'],
      preload: true,
      loop: audio_current.repeat,
      volume: audio_current.volume
    });
    audio_instance._start_volume = audio_current.volume;
    audio_tree[index] = audio_instance;
  } 

  window.audio_tree = audio_tree;

})(window);