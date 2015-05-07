
var theGame = function (game) { };

'use strict';

var Player = function (game, x, y)
{

    Phaser.Sprite.call(this, game, x, y, 'bear');

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.maxVelocityX = 200;
    this.maxVelocityY = 250;
    this.minHealth = 1;
    this.health = 10;
    //this.hittingEnemy = false;
    this.body.setSize(25, 64, 0, 0);

    this.body.collideWorldBounds = true;
    this.body.gravity.y = 400;

    // Set ankarpunkt i centrum
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('walk', [1, 2, 3, 4, 5], 12, true);
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


var playerDir;

var map;

var backgroundlayer;
var groundlayer;
var foregroundlayer;

var pickups;
var granades;
var platforms;
var platformDir = -1;
var seconds;
var timer;

var spikes;
var lavastop;
var lavasbot;
var fireballs;
var bats;
var batAni;
var enemies;

var ends;

var filter;
var sprite;
var turn = -1;

var music;

var crates;
var playerspeed;


theGame.prototype = {

    create: function () {
        
        //physics+bgcolor
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#009999';



        //bgfilter
        this.BackgroundFilter();
        ////map

        map = this.game.add.tilemap('map');
        map.addTilesetImage('tiles2');
        map.addTilesetImage('tiles2dark');
        map.addTilesetImage('tree');
        map.addTilesetImage('tiles1');
        map.addTilesetImage('moveplatform');
        map.addTilesetImage('lava');
        map.addTilesetImage('bat');
        map.setCollisionBetween(1, 100);

        ////backgroundlayer
        backgroundlayer = map.createLayer('background');

        ////groundlayer
        groundlayer = map.createLayer('ground');
        groundlayer.resizeWorld();
        groundlayer.enableBody = true;

        this.player = new Player(this.game, 80, 368-64);

        this.game.camera.follow(this.player);

        this.enemy = new Enemy(this.game, 400, 300);

        this.CreateObjects();
    
        ////foregroundlayer
        foregroundlayer = map.createLayer('foreground');

        this.PlatformTimer();

        //score
        scoreText = this.game.add.text(16, 16, 'Score: 0', { font: "30px Arial" });
        scoreText.fixedToCamera = true;

        //Music
        music = this.game.add.audio("music1");
        music.play('', 0, 1, true);
        music.onLoop.add(this.playLevelMusic, this);


    },

    playLevelMusic: function() {
        music.play('', 0, 1, true);
    },

    PlatformTimer: function()
    {
        
        timer = this.game.time.create(false);

        //  saker händer efter 2 sekunder
        timer.loop(2000, ChangePlatformDir, this);

        timer.start();


        function ChangePlatformDir()
        {
            platformDir = -1 * platformDir;
        
        }
    },

    CreateObjects: function()
    {
        bats = this.game.add.group();
        bats.enableBody = true;

        pickups = this.game.add.group();
        pickups.enableBody = true;

        granades = this.game.add.group();
        granades.enableBody = true;

        platforms = this.game.add.group();
        platforms.enableBody = true;

        crates = this.game.add.group();
        crates.enableBody = true;

        ends = this.game.add.group();
        ends.enableBody = true;

        spikes = this.game.add.group();
        spikes.enableBody = true;

        fireballs = this.game.add.group();
        fireballs.enableBody = true;

        lavastop = this.game.add.group();
        lavastop.enableBody = true;

        lavasbot = this.game.add.group();
        lavasbot.enableBody = true;

        //bats
        map.createFromObjects('enemies', 481, 'bat', 0, true, false, bats);
        //end
        map.createFromObjects('position', 216, 'items2', 0, true, false, ends);
        //burger
        map.createFromObjects('objects', 201, 'items1', 0, true, false, pickups);
        //grenade
        map.createFromObjects('objects', 203, 'items1', 2, true, false, granades);
        //banana
        map.createFromObjects('objects', 206, 'items1', 5, true, false, pickups);
        //platform
        map.createFromObjects('platforms', 73, 'moveplatform', 0, true, false, platforms);
        //crate
        map.createFromObjects('platforms', 475, 'tilesobj', 49, true, false, crates);
        //spikes
        map.createFromObjects('danger', 217, 'items2', 1, true, false, spikes);
        spikes.forEach(function (spike) {

            spike.body.immovable = true;
        },
this);
        //fireballs
        map.createFromObjects('danger', 476, 'danger', 0, true, false, fireballs);
        //lavatypes
        map.createFromObjects('danger', 210, 'lava', 3, true, false, lavastop);
        map.createFromObjects('danger', 213, 'lava', 6, true, false, lavasbot);

        bats.forEach(function (bat) {

        batAni = bat.animations.add('wake', [0, 1, 2, 3, 4, 5], 6, false);
        batAni = bat.animations.add('fly', [6, 7, 8, 9], 12, true);
        bat.body.immovable = true;
        bat.body.tilePadding.set(32);
        },
        this);

        lavastop.forEach(function (lava) {
            lava.animations.add('moving', [3, 4, 5], 2, true);
            lava.body.tilePadding.set(32);
            lava.body.immovable = true;
        },
this);

        lavasbot.forEach(function (lava) {
            lava.animations.add('moving', [6, 7, 8], 2, true);
            lava.body.tilePadding.set(32);
            lava.body.immovable = true;
        },
this);


        //map.createFromObjects('position', 220, 'bear', 0,true,false,this.player);
    },

    KeyControllers: function ()
    {
        cursors = this.game.input.keyboard.createCursorKeys();
        this.player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            
            this.player.scale.x = -1
            this.player.body.velocity.x = -this.player.maxVelocityX;
            this.player.animations.play('walk');

        }
        else if (cursors.right.isDown)
        {
            this.player.scale.x = 1

            this.player.body.velocity.x = this.player.maxVelocityX;
            this.player.animations.play('walk');

        }
        else
        {
            //player.animations.stop();
            this.player.frame = 0;
        }

        if (cursors.up.isDown && this.player.body.onFloor() || cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -this.player.maxVelocityY;
        }
    },

    BatFlying: function()
    {
        bats.forEach(function (bat) {


            
            if (Phaser.Math.distance(this.player.x, this.player.y, bat.x, bat.y) <= 200)
            {
                bat.animations.play('fly')
                bat.body.velocity.x = 100*turn;
                bat.body.velocity.y = 100 * turn;

            }

            if (bat.body.touching.up ||bat.body.touching.down ||bat.body.touching.left ||bat.body.touching.right )
            {
                turn = turn * -1;
            }

            //batAni.onComplete.add(FlyAni, this);

            //bat.events.onAnimationComplete.add(FlyAni, this);

            //function FlyAni()
            //{
            //    bat.animations.play('fly');
            //}

            //bat.events.onAnimationComplete.add(function () {
            //    score++;
            //    batAni = bat.animations.add('wake', [6,7,8,9], 12, true);
            //}, this);

            
            //if(batAni.isFinished == true)
            //{
            //    batAni = bat.animations.add('wake', [0, 1, 2, 3, 4, 5], 12, true);
            //}
            
            //bat.events.onAnimationComplete.add(function ()
            //{
            //    bat.animations.play('wake').play(6);;
            //}, this);
        },
this);
    },



    update: function ()
    {
        filter.update();

        

        

        //Collision

        this.game.physics.arcade.collide(this.player, groundlayer);
        this.game.physics.arcade.collide(this.player, lavasbot, takeDmgY, null, this);
        this.game.physics.arcade.collide(this.enemy, groundlayer);
        this.game.physics.arcade.collide(bats,groundlayer);
        this.game.physics.arcade.overlap(bats, this.player);


        this.game.physics.arcade.collide(this.player, platforms);
        this.game.physics.arcade.collide(this.player, crates);
        this.game.physics.arcade.collide(crates, groundlayer);
        this.game.physics.arcade.collide(fireballs, lavasbot);
        this.game.physics.arcade.overlap(this.player, pickups, collectfood, null, this);
        this.game.physics.arcade.overlap(this.player, ends, endLevel, null, this);
        this.game.physics.arcade.collide(this.player, spikes, takeDmgY, null, this);
        this.game.physics.arcade.collide(this.player, fireballs, takeDmgX, null, this);

        this.BatFlying();

        function endLevel(player,endpos) {
            this.game.state.start("GameOver");
            music.pause();
        }

        function takeDmgY(player, danger) {
            
            this.player.body.velocity.y = -150;
        }

        function takeDmgX(player, danger) {

            player.body.velocity.x = 150* playerDir;
        }

        function collectfood(player, food) {
            //ta bort
            food.kill();
            //lägger till score
            score += 10;
            scoreText.text = 'Score:' + score;
        }

        lavasbot.forEach(function (lava) {
            lava.animations.play('moving');
        },
        this);
        lavastop.forEach(function (lava) {
            lava.animations.play('moving');

        },
        this);


        fireballs.forEach(function (fireball) {
            fireball.anchor.setTo(0.5, 0.5);
            fireball.body.gravity.y = 600;
            fireball.body.velocity.x = 0;
           
            if (fireball.body.velocity.y > 0)
            {
                fireball.scale.y = -1
            }
            else
                fireball.scale.y = 1


            if (fireball.body.touching.down)
            {
                fireball.body.velocity.y = -(this.game.rnd.integerInRange(500, 600));
            }


        },
        this);


        crates.forEach(function (crate) {
            crate.body.gravity.y = 400;

            if (crate.body.touching.left == false || crate.body.touching.right == false)
            {                
                crate.body.velocity.x = 0;
            }
            
    
        },
        this);


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
        playerDir = this.player.scale.x;
        


    },

    render: function () {
        this.game.debug.body(this.player, 'rgba(0, 255, 0, 0.9)');
    },

    BackgroundFilter: function()
{

        // Från http://glslsandbox.com/

    var fragmentSrc = [
"#ifdef GL_ES",
"precision mediump float;",
"#endif",

    "uniform float time;",
    "uniform vec2 mouse;",
    "uniform vec2 resolution;",


    "float cosine_interpolate(float _y1, float _y2, float _r)",
    "{",
        "float r2;",
        "r2 = (1.0 - cos(_r * 3.1415926)) / 2.0;",
        "return (_y1 * (1.0 - r2) + _y2 * r2);",
    "}",

    "float rand(vec2 _v, float _seed)",
    "{",
   "     // 0.0 .. 1.0",
        "return fract(sin(dot(_v, vec2(12.9898, 78.233))) * (43758.5453 + _seed));",
   " }",

   " float noise(vec2 _v, float _seed, vec2 _freq)",
    "{",
        "float fl1 = rand(floor(_v * _freq), _seed);",
        "float fl2 = rand(floor(_v * _freq) + vec2(1.0, 0.0), _seed);",
        "float fl3 = rand(floor(_v * _freq) + vec2(0.0, 1.0), _seed);",
        "float fl4 = rand(floor(_v * _freq) + vec2(1.0, 1.0), _seed);",
        "vec2 fr = fract(_v * _freq);",

   " #if 0",
        "// linear interpolate",
        "float r1 = mix(fl1, fl2, fr.x);",
        "float r2 = mix(fl3, fl4, fr.x);",
        "return mix(r1, r2, fr.y);",
    "#else",
        "// cosine interpolate",
        "float r1 = cosine_interpolate(fl1, fl2, fr.x);",
        "float r2 = cosine_interpolate(fl3, fl4, fr.x);",
        "return cosine_interpolate(r1, r2, fr.y);",
    "#endif",
    "}",

    "float perlin_noise(vec2 _pos, float _seed, float _freq_start, float _amp_start, float _amp_ratio)",
    "{",
        "float freq = _freq_start;",
        "float amp = _amp_start;",
        "float pn = noise(_pos, _seed, vec2(freq, freq)) * amp;",
        "for(int i=0; i<4; i++)",
        "{",
            "freq *= 2.0;",
            "amp *= _amp_ratio;",
            "pn += (noise(_pos, _seed, vec2(freq, freq)) * 2.0 - 1.0) * amp;",
        "}",
        "return pn;",
    "}",

    "void main( void )",
    "{",
        "// position",
        "vec2 pos = (gl_FragCoord.xy / resolution - 0.5) * 2.0;",
        "float a = resolution.x / resolution.y;",
        "pos.x *= a;",

        "// perlin_noise",
        "vec2 pos_ = pos + time * 0.1;",
        "float seed = 0.0;",
        "float freq_start = 1.5;",
        "float amp_start = 1.0;",
        "float amp_ratio = 0.35;",
        "float pn = perlin_noise(pos_, seed, freq_start, amp_start, amp_ratio);",

   " #if 1",
        "// smoke",
        "gl_FragColor = vec4(pn * 0.8, pn * 1.0, pn * 0.9, 1.0);",
    "#else",
        "// dizzy!!!",
        "pn = fract(pn * 20.0 + sin(time));",
        "gl_FragColor = vec4(pn * 3.0, pn * 1.0, pn * 0.2, 1.0);",
    "#endif",
    "}",
    ];

    filter = new Phaser.Filter(this.game, null, fragmentSrc);
    filter.setResolution(800, 600);

    sprite = this.game.add.sprite();
    sprite.width = 800;
    sprite.height = 600;

    sprite.filters = [filter];

}


}
