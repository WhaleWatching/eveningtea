
window.onload = function(){
  setTimeout(function() {
    document.getElementById('gameCanvas').classList.remove('unresloved');
  }, 300);
  cc.game.onStart = function(){
      cc.view.adjustViewPort(false);
      cc.view.resizeWithBrowserSize(false);
      //load resources
      LoaderScene.preload(g_resources, function () {
          cc.director.runScene(new EveningScene());
      }, this);
  };
  cc.game.run();
};