var preload = function(game){}

preload.prototype = {
	preload: function(){ 
          var loadingBar = this.add.sprite(400,240,"loading");
          loadingBar.anchor.setTo(0.5,0.5);
          this.load.setPreloadSprite(loadingBar);

		this.game.load.spritesheet("numbers","/Content/assets/numbers.png",100,100);
		this.game.load.image("gametitle", "/Content/assets/gametitle.png");
		this.game.load.image("play", "/Content/assets/play.png");
		this.game.load.image("higher", "/Content/assets/higher.png");
		this.game.load.image("lower", "/Content/assets/lower.png");
		this.game.load.image("gameover", "/Content/assets/gameover.png");

		this.game.load.tilemap('map', '/Content/gameassets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('burger', '/Content/gameassets/burger.png');
		this.game.load.image('tiles2', '/Content/gameassets/tiles2.png');
		this.game.load.image('items', '/Content/gameassets/items1.png');
		this.game.load.image('tree', '/Content/gameassets/tree.png');
		this.game.load.spritesheet('bear', '/Content/gameassets/charsprites.png', 32, 64);
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}