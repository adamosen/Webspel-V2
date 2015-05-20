var preload = function(game){}

preload.prototype = {
	preload: function(){ 
	    var loadingBar = this.add.sprite(400, 240, "loading");
	   

          loadingBar.anchor.setTo(0.5,0.5);
          this.load.setPreloadSprite(loadingBar);

		this.game.load.spritesheet("numbers","/Content/assets/numbers.png",100,100);
		this.game.load.image("gametitle", "/Content/assets/gametitle.png");
		this.game.load.image("play", "/Content/assets/play.png");
		this.game.load.image("higher", "/Content/assets/higher.png");
		this.game.load.image("lower", "/Content/assets/lower.png");
		this.game.load.image("gameover", "/Content/assets/gameover.png");
	    //map
		this.game.load.tilemap('map', '/Content/gameassets/levels/leveljun0.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('map2', '/Content/gameassets/levels/level2new.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('map3', '/Content/gameassets/levels/leveltre.json', null, Phaser.Tilemap.TILED_JSON);

		this.game.load.image('burger', '/Content/gameassets/burger.png');
		this.game.load.image('tiles2', '/Content/gameassets/tiles2.png');
		this.game.load.image('tiles2dark', '/Content/gameassets/tiles2dark.png');
		this.game.load.image('tree', '/Content/gameassets/tree.png');
		this.game.load.image('moveplatform','/Content/gameassets/move_platform.png');

		this.game.load.spritesheet('water', '/Content/gameassets/watertiles.png', 32, 32);
		this.game.load.spritesheet('lava', '/Content/gameassets/lavatiles.png', 32, 32);
		this.game.load.spritesheet('items1', '/Content/gameassets/items1.png', 32, 32);
        this.game.load.spritesheet('tilesobj', '/Content/gameassets/tiles2.png', 32, 32);
        this.game.load.spritesheet('items2', '/Content/gameassets/items2.png', 32, 32);
        this.game.load.spritesheet('danger', '/Content/gameassets/dangers.png', 16, 16);
        this.game.load.spritesheet('boom', '/Content/gameassets/boom1.png', 64, 64);

        //karaktärer
        this.game.load.spritesheet('bear', '/Content/gameassets/charsprites.png', 32, 64);
        this.game.load.spritesheet('bat', '/Content/gameassets/bat.png', 32, 32);
        this.game.load.spritesheet('hp', '/Content/gameassets/hp.png', 32, 32);

	    //pauseKey
        this.game.load.image('pauseKey', '/Content//gameassets//burger.png');

	    //audio
        this.game.load.audio("music1", "/Content/gameassets/music/Jazz Jackrabbit 2 - Medival Jam.m4a");
        this.game.load.spritesheet("play_pause", "/Content/gameassets/play_pause.png", 34, 34);
	},
	create: function ()
	{
      
		this.game.state.start("GameTitle");
  	},
    update: function ()
    {
       
    }
}