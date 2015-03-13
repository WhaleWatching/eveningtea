(function(window){

  // Audio res list

  // Audio res
  var res_action_mountain = 'res/audio/action_mountain';

  // Audio using
  var audio_using = {
    action_mountain: {
      res: res_action_mountain,
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
      formats: ['ogg'],
      preload: true,
      loop: audio_current.repeat,
      volume: audio_current.volume
    });
    audio_instance._start_volume = audio_current.volume;
    audio_tree[index] = audio_instance;
  } 

  window.audio_tree = audio_tree;

})(window);