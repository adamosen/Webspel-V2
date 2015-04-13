var preload = function(game){}

preload.prototype = {
	preload: function(){ 
          var loadingBar = this.add.sprite(160,240,"loading");
          loadingBar.anchor.setTo(0.5,0.5);
          this.load.setPreloadSprite(loadingBar);
		this.game.load.spritesheet("numbers","/Content/assets/numbers.png",100,100);
		this.game.load.image("gametitle", "/Content/assets/gametitle.png");
		this.game.load.image("play", "/Content/assets/play.png");
		this.game.load.image("higher", "/Content/assets/higher.png");
		this.game.load.image("lower", "/Content/assets/lower.png");
		this.game.load.image("gameover", "/Content/assets/gameover.png");
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}