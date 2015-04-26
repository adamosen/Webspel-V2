var boot = function(game){
	console.log("%cStarting game", "color:white; background:red");
};
  
boot.prototype =
    {
        preload: function ()
        {
          this.game.load.image("loading","/Content/assets/loading.png"); 
	    },
        create: function ()
        {
		    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		    this.scale.pageAlignHorizontally = true;
		    this.scale.setScreenSize();
		    this.game.state.start("Preload");
        }
    
}