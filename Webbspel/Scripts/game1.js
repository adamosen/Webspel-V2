
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update, render: render});
var player;
var cursors;
var pickups;
var food;

var score = 0;
var scoreText;

var map;
var backgroundlayer;
var groundlayer;




function preload() {

    game.load.tilemap('map', '/Content/gameassets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('burger', '/Content/gameassets/burger.png');
    game.load.image('tiles2', '/Content/gameassets/tiles2.png');
    game.load.image('items', '/Content/gameassets/items1.png');
    game.load.image('tree', '/Content/gameassets/tree.png');
    game.load.spritesheet('bear', '/Content/gameassets/charsprites.png', 32, 64);

}



function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#33CCFF';
    map = game.add.tilemap('map');
    map.addTilesetImage('tiles2');
    map.addTilesetImage('tree');
    map.addTilesetImage('items');



    //background = map.createLayer('BackgroundLayer');

    //background.resizeWorld();
    groundlayer = map.createLayer('ground');

    groundlayer.resizeWorld();

    groundlayer.enableBody = true;


    player = game.add.sprite(32, game.world.height - 500, 'bear');

    //gör till player
    game.physics.arcade.enable(player);
    game.camera.follow(player);
    player.body.tilePadding.set(32);

    //fysik till player
    player.body.bounce.y = 0.0;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;

    // animation, de sista 2 är fps och true är för att den ska loopa
    player.animations.add('left', [1, 2, 3, 4, 5], 10, true);
    player.animations.add('right', [5, 4, 3, 2, 1], 10, true);


    map.setCollisionBetween(1, 100);

    pickups = game.add.group();
    pickups.enableBody = true;

    food = pickups.create(64, 0, 'burger');

    food.body.gravity.y = 500;
    //// fysik kommer funka för platformar

    //background.enableBody = true;

    //fysik kommer funka

    //for (var i = 0; i < 10; i++) {

    //    food = pickups.create(64 * i, 0, 'burger');

    //    food.body.gravity.y = 500;
    //     bounce är ett värde mellan 0 o 1
    //    food.body.bounce.y = 0.5 + Math.random() * 0.2;
    //}

    //score
    scoreText = game.add.text(16, 16, 'Score: 0', { font: "30px Arial"});

    scoreText.fixedToCamera = true;


}

function update() {
    //kollision
    game.physics.arcade.collide(player, groundlayer);
    game.physics.arcade.collide(pickups,pickups);
    game.physics.arcade.collide(pickups, groundlayer);
    game.physics.arcade.collide(player,pickups);

    //om spelare overlappar pickup kör funktion
    game.physics.arcade.overlap(player, pickups, collectitem, null, this);

    function collectitem(player, food) {
        //ta bort
        food.kill();
        //lägger till score
        score += 10;
        scoreText.text = 'Score:' + score;
    }
    //kontroll
    cursors = game.input.keyboard.createCursorKeys();
    //gör så han stannar
    player.body.velocity.x = 0;
    //player.body.velocity.y = 0;

    //if (cursors.up.isDown) {
    //    player.body.velocity.y = -150;
    //    player.animations.play('left');
    //}
    //else if (cursors.down.isDown) {
    //    player.body.velocity.y = 150;
    //    player.animations.play('right');
    //}

    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    else {
        player.animations.stop();
        player.frame = 0;
    }

    if (cursors.up.isDown && player.body.onFloor()) {
        player.body.velocity.y = -250;
    }


}

function render()
{
    game.debug.body(player, 'rgba(0, 255, 0, 0.9)');
}