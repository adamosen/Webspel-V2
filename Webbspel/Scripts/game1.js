
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update, render: render});
var player;
var enemy;
var turn;
var tween;
var cursors;
var pickups;
var food;

var score = 0;
var scoreText;

var map;
var backgroundlayer;
var groundlayer;

var music;
var flag = true;
var button;
var playmusic = 0;

var bullets;
var fireButton;
var bulletTime = 0;
var dir;


function preload() {

    game.load.tilemap('map', '/Content/gameassets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('burger', '/Content/gameassets/burger.png');
    game.load.image('tiles2', '/Content/gameassets/tiles2.png');
    game.load.image('items', '/Content/gameassets/items1.png');
    game.load.image('tree', '/Content/gameassets/tree.png');


    //spritesheets
    game.load.spritesheet('bear', '/Content/gameassets/charsprites.png', 32, 64);
    game.load.spritesheet("play_pause", "/Content/assets/play_pause.png", 34, 34);

    //audio
    game.load.audio("GameSong", "/Content/assets/GameSong.mp3");

    //bullets
    game.load.image('bullet', '/Content/assets/bullet.png');


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


    //Music
    music = game.add.audio("GameSong");

    
    music.play();


    button = game.add.button(750, 16, 'play_pause', actionOnClick, this, playmusic, 1);
    button.fixedToCamera = true;


    //enemy grejer
    enemy = game.add.sprite(300, game.world.height - 500, 'bear');

    //gör till player
    game.physics.arcade.enable(enemy);
    enemy.body.tilePadding.set(32);

    //fysik till player
    enemy.body.bounce.y = 0.0;
    enemy.body.gravity.y = 400;
    enemy.body.collideWorldBounds = true;
    enemy.body.immovable = true;
    //tween = game.add.tween(enemy).to({ x: 200}, 4000, Phaser.Easing.Linear.None, true, 0, 1000, true)

    // animation, de sista 2 är fps och true är för att den ska loopa
    //enemy.animations.add('left', [1, 2, 3, 4, 5], 10, true);
    //enemy.animations.add('right', [5, 4, 3, 2, 1], 10, true);




    //bullets
    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', -0.5);
    bullets.setAll('anchor.y', -1.2);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);



}

function update() {
    //kollision
    game.physics.arcade.collide(player, groundlayer);
    game.physics.arcade.collide(player, enemy);
    game.physics.arcade.collide(pickups,pickups);
    game.physics.arcade.collide(pickups, groundlayer);
    game.physics.arcade.collide(player,pickups);
    game.physics.arcade.collide(enemy, groundlayer);
    
    //om spelare overlappar pickup kör funktion
    game.physics.arcade.overlap(player, pickups, collectitem, null, this);
    game.physics.arcade.overlap(bullets, enemy, killEnemy, null, this);
    game.physics.arcade.overlap(bullets, groundlayer, wallCollide, null, this);
    game.physics.arcade.overlap(enemy, groundlayer, enemyWallCollide, null, this);

    function collectitem(player, food) {
        //ta bort
        food.kill();
        //lägger till score
        score += 10;
        scoreText.text = 'Score:' + score;
    }
    //kontroll
    cursors = game.input.keyboard.createCursorKeys();

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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
        dir = -1;
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
        dir = 1;
    }
    else {
        player.animations.stop();
        player.frame = 0;
    }

    if (cursors.up.isDown && player.body.onFloor()) {
        player.body.velocity.y = -250;
    }
    if (fireButton.isDown) {
        fireBullet();
    }
    //enemy movement
    enemy.body.velocity.x = 100 * turn;
}

function render()
{
    game.debug.body(player, 'rgba(0, 255, 0, 0.9)');
}






function actionOnClick() {

    if (flag) {
        music.pause();
        playmusic = 1;
    }
    else {
        music.resume();
        playmusic = 0;
    }

    flag = !flag;

}

function fireBullet() {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime) {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            //  And fire it
            bullet.reset(player.x, player.y +1);
            bullet.body.velocity.x = 500*dir;

            bulletTime = game.time.now + 200;
        }
    }
}
function killEnemy(enemy, bullets) {
    //ta bort
    enemy.kill();
    bullets.kill();
    //lägger till score
    score += 10;
    scoreText.text = 'Score:' + score;
}

function wallCollide(bullets,groundLayer)
{   
    bullets.kill();

}

function enemyWallCollide(enemy,groundLayer)
{
    turn = -1;
}