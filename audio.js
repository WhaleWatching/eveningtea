(function(window){

  // Audio res list

  // Audio res

  // Audio res for test
  var res_audio_prelude = 'res/audio/prelude';

  // Audio using
  var audio_using = {
    background: res_audio_prelude,
    curtain: null,
    action_talk: null,
    action_tea: null,
    mountaining: null,
    drinking: null,
    drinking_end: null,
    teapot_show: null,
    mountain_show: null,
    ammo_show: null,
    tea_filling: null
  }

  // Audio options
  var audio_option = {
    formats: ['mp3'],
    preload: true
  }
  var audio_option_repeat = {
    formats: ['mp3'],
    preload: true,
    loop: true
  }


  var audio_tree = {};

  audio_tree.audio_background = new buzz.sound(audio_using.background, audio_option_repeat);

  window.audio_tree = audio_tree;

})(window);