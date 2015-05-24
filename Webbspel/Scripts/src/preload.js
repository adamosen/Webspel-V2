//PRELOAD STATE SENAST �NDRAS AV ADAM 2015-05-23//

var preload = function (game) { }

preload.prototype = {
	preload: function(){ 
	    var loadingBar = this.add.sprite(400, 240, "loading");
	   

          loadingBar.anchor.setTo(0.5,0.5);
          this.load.setPreloadSprite(loadingBar);

        //LADDAR IN MENY KNAPPAR//
		this.game.load.image("gametitle", "/Content/assets/gametitle.png");
		this.game.load.image("play", "/Content/assets/play.png");
		this.game.load.image("higher", "/Content/assets/higher.png");
		this.game.load.image("lower", "/Content/assets/lower.png");
		this.game.load.image("gameover", "/Content/assets/gameover.png");
		this.game.load.image("wingame", "/Content/assets/wingame.png");
		this.game.load.spritesheet('PLAYPAUSE', '/Content//gameassets//play_pause.png',37.2,34);

	    //LADDAR IN MAPS//
		this.game.load.tilemap('map', '/Content/gameassets/levels/leveljun0.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('map2', '/Content/gameassets/levels/level2newest2.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('map3', '/Content/gameassets/levels/level3tree.json', null, Phaser.Tilemap.TILED_JSON);


        //TEXTURER F�R TILES//
		this.game.load.image('tiles2', '/Content/gameassets/tiles2.png');
		this.game.load.image('tiles2dark', '/Content/gameassets/tiles2dark.png');

        //TEXTURER F�R OBJEKT//
		this.game.load.image('moveplatform','/Content/gameassets/move_platform.png');
		this.game.load.image('tree', '/Content/gameassets/tree.png');
		this.game.load.spritesheet('water', '/Content/gameassets/watertiles.png', 32, 32);
		this.game.load.spritesheet('lava', '/Content/gameassets/lavatiles.png', 32, 32);
		this.game.load.spritesheet('items1', '/Content/gameassets/items1.png', 32, 32);
        this.game.load.spritesheet('tilesobj', '/Content/gameassets/tiles2.png', 32, 32);
        this.game.load.spritesheet('items2', '/Content/gameassets/items2.png', 32, 32);
        this.game.load.spritesheet('danger', '/Content/gameassets/dangers.png', 16, 16);
        this.game.load.spritesheet('boom', '/Content/gameassets/boom1.png', 64, 64);

        //KARAKT�RER////FIENDER//
        this.game.load.spritesheet('bear', '/Content/gameassets/charsprites.png', 32, 64);
        this.game.load.spritesheet('bat', '/Content/gameassets/bat.png', 32, 32);
        this.game.load.spritesheet('hp', '/Content/gameassets/hp.png', 32, 32);
        this.game.load.spritesheet('boss', '/Content/gameassets/boss.png', 96, 96);

	    //ALL MUSIK//
        this.game.load.audio("music1", "/Content/gameassets/music/level2music.wav");
        this.game.load.audio("music2", "/Content/gameassets/music/level1music.wav");
        this.game.load.audio("music3", "/Content/gameassets/music/level3music.wav");
	},
	create: function ()
	{
      //Startar speltiteln
		this.game.state.start("GameTitle");
  	},
    update: function ()
    {
       
    }
}