
var theGame = function (game) { };

'use strict';
var Player = function (game, x, y) {

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

        Player.prototype.moveRight = function ()
        {
            this.body.velocity.x = 150;
            this.animations.play('right');
        };

var player = this.player;
var cursors;
var pickups;
var food;
var score = 0;
var scoreText;
var map;
var backgroundlayer;
var groundlayer;


theGame.prototype = {

    create: function () {
        
        //physics+bgcolor
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#33CCFF';
        ////map
        map = this.game.add.tilemap('map');
        map.addTilesetImage('tiles2');
        map.addTilesetImage('tree');
        map.addTilesetImage('items');
        map.setCollisionBetween(1, 100);
        ////groundlayer
        groundlayer = map.createLayer('ground');
        groundlayer.resizeWorld();
        groundlayer.enableBody = true;

        this.player = new Player(this.game, 32, 300);

        this.game.camera.follow(this.player);

    },

    update: function ()
    {
        this.game.physics.arcade.collide(this.player, groundlayer);

        //Kontroll
        cursors = this.game.input.keyboard.createCursorKeys();
        this.player.body.velocity.x = 0;
        if (cursors.left.isDown)
        {
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');

        }
        else if (cursors.right.isDown)
        {
            //this.player.prototype.moveRight();
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');

        }
        else
        {
            //player.animations.stop();
            this.player.frame = 0;
        }

        if (cursors.up.isDown && this.player.body.onFloor()) {
            this.player.body.velocity.y = -250;
        }


    }

}