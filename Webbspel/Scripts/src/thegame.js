
var theGame = function (game) { };

'use strict';

var Player = function (game, x, y)
{

    Phaser.Sprite.call(this, game, x, y, 'bear');

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    
    //this.maxVelocityX = 200;
    //this.maxVelocityY = 600;
    //this.minHealth = 1;
    //this.health = 10;
    //this.hittingEnemy = false;

    //this.smoothed = false;
    this.body.collideWorldBounds = true;
    this.body.gravity.y = 400;
    //this.anchor.setTo(0.5, 0.5);
    //this.body.setSize(64, 100, 25, 6);

    this.animations.add('left', [1, 2, 3, 4, 5], 12, true);
    this.animations.add('right', [1, 2, 3, 4, 5], 12, true);
    this.body.tilePadding.set(32);
    this.game.add.existing(this);



};


Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

var Enemy = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'bear');

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.gravity.y = 400;

    this.animations.add('left', [1, 2, 3, 4, 5], 12, true);
    this.animations.add('right', [1, 2, 3, 4, 5], 12, true);
    this.body.tilePadding.set(32);
    this.game.add.existing(this);

};
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;


var player = this.player;
var enemy = this.enemy;
var cursors;
var pickups;
var food;
var score = 0;
var scoreText;
var map;
var backgroundlayer;
var groundlayer;
var foregroundlayer;
var pickups;
var platforms;
var platformDir = -1;
var seconds;
var timer;


theGame.prototype = {

    create: function () {
        
        //physics+bgcolor
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#009999';
        ////map

        map = this.game.add.tilemap('map');
        map.addTilesetImage('tiles2');
        map.addTilesetImage('tree');
        map.addTilesetImage('tiles1');
        map.setCollisionBetween(1, 100);

        ////backgroundlayer
        backgroundlayer = map.createLayer('background');

        ////groundlayer
        groundlayer = map.createLayer('ground');
        groundlayer.resizeWorld();
        groundlayer.enableBody = true;

        pickups = this.game.add.group();
        pickups.enableBody = true;

        platforms = this.game.add.group();
        platforms.enableBody = true;
        
        //platform1 = platforms.create(64, 64, 'burger');

        this.CreateObjects();

        this.player = new Player(this.game, 80, 368-64);

        this.game.camera.follow(this.player);

        this.enemy = new Enemy(this.game, 400, 300);

        ////foregroundlayer
        foregroundlayer = map.createLayer('foreground');
        //foregroundlayer.resizeWorld();

        this.PlatformTimer();

    },

    PlatformTimer: function()
    {
        //  Create our Timer
        timer = this.game.time.create(false);

        //  Set a TimerEvent to occur after 2 seconds
        timer.loop(2000, ChangePlatformDir, this);

        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        timer.start();


        function ChangePlatformDir()
        {
            platformDir = -1 * platformDir;
        
        }
    },

    CreateObjects: function()
    {
        //burger
        map.createFromObjects('objects', 201, 'items1', 0, true, false, pickups);
        //grenade
        map.createFromObjects('objects', 203, 'items1', 2, true, false, pickups);
        //banana
        map.createFromObjects('objects', 206, 'items1', 5, true, false, pickups);
        //platform
        map.createFromObjects('platforms', 73,'items1',0,true,false,platforms);

        //playerhttp://localhost:51453/Content/gameassets/items2.png
        //map.createFromObjects('position', 220, 'bear', 0,true,false,this.player);
    },

    moveRight: function ()
    {
        this.player.body.velocity.x = 150;
        this.player.animations.play('right');
    },

    moveLeft: function ()
    {
        this.player.body.velocity.x = -150;
        this.player.animations.play('right');
    },

    KeyControllers: function ()
    {
        cursors = this.game.input.keyboard.createCursorKeys();
        this.player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {

            this.moveLeft();

        }
        else if (cursors.right.isDown)
        {

            this.moveRight();

        }
        else
        {
            //player.animations.stop();
            this.player.frame = 0;
        }

        if (cursors.up.isDown && this.player.body.onFloor() || cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -250;
        }
    },


    update: function ()
    {
       
        //Collision
        this.game.physics.arcade.collide(this.player, groundlayer);
        this.game.physics.arcade.collide(this.enemy, groundlayer);

        this.game.physics.arcade.collide(this.player, platforms);

        //seconds = Math.floor(this.game.time.time / 1000) % 60;
        //this.game.time.events.add(time, changePlatformDir, this);;

        platforms.forEach(function (platform)
        {
            platform.body.immovable = true;
            platform.body.allowGravity = false;
            platform.body.collideWorldBounds = true;

            platform.body.velocity.y = 50 * platformDir;
            platform.body.velocity.x = 0;

        },
        this);

        //Kontroll
        this.KeyControllers();


    }

}
