
window.onload = function(){
  cc.game.onStart = function(){
      cc.view.adjustViewPort(false);
      cc.view.resizeWithBrowserSize(false);
      //load resources
      cc.LoaderScene.preload(g_resources, function () {
          cc.director.runScene(new EveningScene());
      }, this);
  };
  cc.game.run();
};