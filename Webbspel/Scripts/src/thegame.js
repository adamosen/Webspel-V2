
var theGame = function (game) { };

'use strict';

var Player = function (game, x, y)
{

    Phaser.Sprite.call(this, game, x, y, 'bear');

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.maxVelocityX = 200;
    this.maxVelocityY = 300;
    this.health = 3;
    this.body.setSize(25, 64, 0, 0);

    //this.body.collideWorldBounds = true;
    this.body.gravity.y = 400;

    // Set ankarpunkt i centrum
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('walk', [1, 2, 3, 4, 5], 12, true);
    this.body.tilePadding.set(32);
    this.game.add.existing(this);



};


Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//var HP = function (game, x, y) {

//    ////lives
//    //Phaser.Sprite.call(this, game, x + (35 * i), y, 'hp');
//    //var hp;
//    //hp = this.game.add.group();

//    //this.game.add.text(this.game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

//    //var dude = lives.create(game.world.width - 100 + (30 * i), 60, 'dude');
//    //var lives;
//    //lives = game.add.group();

//    //for (var i = 0; i < 3; i++)
//    //{
    
//    //    lives.create(x + (35 * i), y + 60, 'hp');

//        Phaser.Sprite.call(this, game, x, y, 'hp');
      
//    //}


//    //this.body.tilePadding.set(32);
//    this.game.add.existing(this);

//};
//HP.prototype = Object.create(Phaser.Sprite.prototype);
//HP.prototype.constructor = HP;

var player = this.player;
//var HP = this.HP;
var cursors;
var tossgranadeButton;
var tossshurikenButton;
var pickups;
var food;
var score = 0;
var scoreText;
var justPressed = false;

var pauseKey;
var worldTimer;
var timecounter = 0;
var deathcounter = 2;
var granadeCount = 0;
var shurikenCount = 0;
var flyingPotionCount = 0;

var playerDir;

var map;
var flyingpotions;
var canFly = false;


var backgroundlayer;
var groundlayer;
var foregroundlayer;

var pickups;
var shurikens;
var granades;
var currentFlyTime;

var platforms;
var platformDir = -1;
var seconds;
var timer;
var dmgCount;

var spikes;
var lavastop;
var lavasbot;
var fireballs;
var bats;
var level = 1;
var batAni;
var enemies;
//var lifesleft = 3;

var lives;
var booms;
//var boom;

var ends;

var hp;

var filter;
var sprite;
var turnV = -1;
var turnH = -1;

var hpText;
var granadeText;

var music;

var crates;
var playerspeed;

var grandeTimer = 0;
var shurikenTimer = 0;
var weaponGranades;
var weaponShurikens;

var potionTimer = 0;

theGame.prototype = {

    create: function () {
        
        //physics+bgcolor
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#009999';



        //bgfilter
        this.BackgroundFilter();
        ////map





        if (level == 1)

        {
            map = this.game.add.tilemap('map');
            this.player = new Player(this.game, 80, 368 - 64);
            this.game.camera.follow(this.player);
        }

        if (level == 2) {
            map = this.game.add.tilemap('map2');
            this.player = new Player(this.game, 16, 1568- 64);
            this.game.camera.follow(this.player);
        }

        if (level == 3) {
            map = this.game.add.tilemap('map3');
            this.player = new Player(this.game, 16, 656 - 64);
            this.game.camera.follow(this.player);
        }

        map.addTilesetImage('tiles2');
        map.addTilesetImage('tiles2dark');
        map.addTilesetImage('tree');
        map.addTilesetImage('tiles1');
        map.addTilesetImage('moveplatform');
        map.addTilesetImage('lava');
        map.addTilesetImage('bat');
        //map.setCollisionBetween(1, 100);

        ////backgroundlayer
        backgroundlayer = map.createLayer('background');

        ////groundlayer
        groundlayer = map.createLayer('ground');
        map.setCollisionBetween(1, 1000, true, 'ground');
        groundlayer.resizeWorld();
        groundlayer.enableBody = true;

        lives = this.game.add.group();

        //this.player = new Player(this.game, 16, 1568-64);

        //this.game.camera.follow(this.player);

        
        this.CreateObjects();
    
        ////foregroundlayer
        foregroundlayer = map.createLayer('foreground');

        this.PlatformTimer();

        //granades
        granadeText = this.game.add.text(16,96, 'Granades: 0', { font: "20px Arial", fill: '#003000'})
        granadeText.fixedToCamera = true;
        

        //score
        scoreText = this.game.add.text(16, 16, 'Score: 0', { font: "40px Arial", fill: '#fff' });
        scoreText.fixedToCamera = true;

        hpText = this.game.add.text(16, 48, 'hp: 0', { font: "30px Arial", fill: '#fff' });
        hpText.fixedToCamera = true;

        //Music
        music = this.game.add.audio("music1");
        music.play('', 0, 1, true);
        music.onLoop.add(this.playLevelMusic, this);

        this.UpdateHp();


        ////pausar spelet och timern
        pauseKey = this.game.add.sprite(800-64, 96, 'pauseKey');
        pauseKey.fixedToCamera = true;
        pauseKey.inputEnabled = true;
        pauseKey.events.onInputUp.add(function () {
            this.game.paused = true;
        }, this);
        this.game.input.onDown.add(function () { if (this.game.paused) this.game.paused = false; }, this);

        ////timer
        worldTimer = this.game.add.text(800-64, 32, '0');
        worldTimer.fixedToCamera = true;
        currentTimer = this.game.time.create(false);
        currentTimer.loop(1000, this.updateTimer, this);
        currentTimer.start();
    },

    updateTimer: function () {
        deathcounter++;
        timecounter++;
        worldTimer.setText(timecounter);
    },

    UpdateHp: function()
    {
        //  Lives   
        for (var i = 0; i < this.player.health; i++) {
            hp = lives.create(80 - 35 * i, 64, 'hp');
            hp.fixedToCamera = true;
        }
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
        //function returnNormal() {
        //    this.player.body.gravity.y = 400;
        //    canFly = false;
        //    //potionTimer.stop();
        //}
    },

    CreateObjects: function()
    {
        //granades
        //  Our granade group
        weaponGranades = this.game.add.group();
        weaponGranades.enableBody = true;
        weaponGranades.physicsBodyType = Phaser.Physics.ARCADE;
        //weaponGranades.createMultiple(5, 'items1', 2);
        //weaponGranades.setAll('anchor.x', -0.5);
        //weaponGranades.setAll('anchor.y', 1);
        weaponGranades.setAll('outOfBoundsKill', true);
        weaponGranades.setAll('checkWorldBounds', true);

        //shurikens
        //  Our shuriken group
        weaponShurikens = this.game.add.group();
        weaponShurikens.enableBody = true;
        weaponShurikens.physicsBodyType = Phaser.Physics.ARCADE;
        weaponShurikens.createMultiple(3, 'items1', 4);
        weaponShurikens.setAll('anchor.x', -0.5);
        weaponShurikens.setAll('anchor.y', 1);
        weaponShurikens.setAll('outOfBoundsKill', true);
        weaponShurikens.setAll('checkWorldBounds', true);


        bats = this.game.add.group();
        bats.enableBody = true;

        booms = this.game.add.group();
        booms.enableBody = true;

        

        pickups = this.game.add.group();
        pickups.enableBody = true;

        shurikens = this.game.add.group();
        shurikens.enableBody = true;

        granades = this.game.add.group();
        granades.enableBody = true;

        flyingpotions = this.game.add.group();
        flyingpotions.enableBody = true;

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

        //shurikens
        map.createFromObjects('objects', 205, 'items1', 4, true, false, shurikens);
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
        //flyingPotion
        map.createFromObjects('objects', 204, 'items1', 3, true, false, flyingpotions);
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
        //bats
        bats.forEach(function (bat)
        {            
        batAni = bat.animations.add('wake', [0, 1, 2, 3, 4, 5], 6, false);
        batAni = bat.animations.add('fly', [6, 7, 8, 9], 12, true);
        bat.body.tilePadding.set(32);
        },
        this);

//        weaponGranades.forEach(function (granade)
//        {
//            granade.body.gravity.y = 400;
//            granade.body.bounce.set(0.5);
//        },
//this);

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


    tossShuriken: function () {
        
        //  To avoid them being allowed to fire too fast we set a time limit
        if (this.game.time.now > shurikenTimer) {
            //  Grab the first bullet we can from the pool
            weaponShuriken = weaponShurikens.getFirstExists(false);
            //weaponShuriken.anchor.setTo(0.5, 0.5);
            
            if (weaponShuriken) {
                //  And fire it
                weaponShuriken.reset(this.player.x, this.player.y + 1);
                if (this.player.scale.x == -1)
                {
                    weaponShuriken.body.angularVelocity = -800;
                    weaponShuriken.body.velocity.x = -500;
                }

                if (this.player.scale.x == 1)
                {
                    weaponShuriken.body.angularVelocity = 800;
                    weaponShuriken.body.velocity.x = 500;
                }

                shurikenTimer = this.game.time.now + 200;
            }
        }
    },

    tossGranade: function ()
    {
        //To avoid them being allowed to fire too fast we set a time limit
        if (this.game.time.now > grandeTimer && granadeCount > 0)
        {
            //  Grab the first bullet we can from the pool
            //weaponGranade = weaponGranades.getFirstExists(false);
            weaponGranade = weaponGranades.create(0, 0, 'items1', 2);


            weaponGranades.forEach(function (weaponGranade)
            {
                weaponGranade.anchor.setTo(0.5, 0.5);

                this.game.time.events.add(Phaser.Timer.SECOND * 3, function ()
                {
                    
                    justPressed = false;
                    bats.forEach(function (bat) {

                        if (Phaser.Math.distance(weaponGranade.x, weaponGranade.y, bat.x, bat.y) <= 150)
                        {
                            bat.kill();

                        }

                    },
this);

                    var boom = booms.create(weaponGranade.body.x, weaponGranade.body.y, "boom");
                    boom.anchor.setTo(0.5, 0.5);
                    boom.scale.set(4, 4);

                    booms.forEach(function (boom)
                        {
                             boom.animations.add('boom', [0, 1, 2, 3, 4, 3 ,2, 1,0], true);


                        },
                        this);
                        
                                 
                    boom.animations.play('boom', 6, false, true);

                    weaponGranade.kill();

                }, this);
            },
            this);


            
            if (weaponGranade)
            {                
                weaponGranade.allowRotation = true;
                weaponGranade.body.gravity.y = 400;
                weaponGranade.body.bounce.set(0.5);
                //weaponGranade.body.angularVelocity = 200;
                //weaponGranade.friction = new Phaser.Point(1, 0.5);
                //var rotate = weaponGranade.rotation;
             //  And fire it
                weaponGranade.reset(this.player.x, this.player.y + 1);
                if (this.player.scale.x == 1)
                {
                    weaponGranade.body.velocity.x = 500;
                    weaponGranade.body.angularVelocity = 500;
                }
                else if (this.player.scale.x == -1)
                {
                    weaponGranade.body.velocity.x = -500;
                    weaponGranade.body.angularVelocity = -500;
                }

            grandeTimer = this.game.time.now + 3000;
            }
        }
          
},

    KeyControllers: function ()
    {
        cursors = this.game.input.keyboard.createCursorKeys();
        tossgranadeButton = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
        tossshurikenButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        if(deathcounter > 1)
            this.player.body.velocity.x = 0;

        if (tossgranadeButton.isDown && justPressed == false) {
          
            this.tossGranade();
            justPressed = true;
        }
        if (tossshurikenButton.isDown) {

            this.tossShuriken();
        }
           

        if (cursors.up.isDown && canFly == true) {

            this.player.body.velocity.y = -this.player.maxVelocityX;
            //this.player.animations.play('walk');

        }

        if (cursors.down.isDown && canFly == true) {

            this.player.body.velocity.y = this.player.maxVelocityX;
            //this.player.animations.play('walk');

        }
        if (cursors.left.isDown && deathcounter > 1)
        {
            
            this.player.scale.x = -1
            this.player.body.velocity.x = -this.player.maxVelocityX;
            this.player.animations.play('walk');

        }
        else if (cursors.right.isDown && deathcounter > 1)
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

        if (cursors.up.isDown && this.player.body.onFloor() && deathcounter > 1 || cursors.up.isDown && this.player.body.touching.down && deathcounter > 1) {
            this.player.body.velocity.y = -this.player.maxVelocityY;
        }
    },

    BatFlying: function()
    {
        bats.forEach(function (bat) {


            bat.body.bounce.set(1);
            if (Phaser.Math.distance(this.player.x, this.player.y, bat.x, bat.y) <= 200 && bat.body.velocity.y == 0 && bat.body.velocity.x == 0)
            {
                bat.animations.play('fly')
                bat.body.velocity.y = this.game.rnd.integerInRange(-100, 100);
                bat.body.velocity.x = this.game.rnd.integerInRange(-100, 100);
                

            }

        },
this);
    },




    update: function ()
    {
        filter.update();
        
        hpText.text = this.player.health;
        //Collision

        this.game.physics.arcade.collide(this.player, groundlayer);
        this.game.physics.arcade.collide(this.player, lavasbot, takeDmgFatal, null, this);
        this.game.physics.arcade.collide(this.enemy, groundlayer);
        this.game.physics.arcade.collide(weaponGranades, groundlayer);
        this.game.physics.arcade.overlap(bats,groundlayer);
        //this.game.physics.arcade.overlap(bats, this.player);


        this.game.physics.arcade.collide(this.player, platforms);
        this.game.physics.arcade.collide(this.player, crates);
        this.game.physics.arcade.collide(crates, groundlayer);
        this.game.physics.arcade.collide(fireballs, lavasbot);
        this.game.physics.arcade.overlap(this.player, pickups, collectfood, null, this);
        this.game.physics.arcade.overlap(this.player, shurikens, collectShuriken, null, this);
        this.game.physics.arcade.overlap(this.player, flyingpotions, collectFlyingPotion, null, this);
        this.game.physics.arcade.overlap(this.player, granades, collectGranade, null, this);
        this.game.physics.arcade.overlap(this.player, ends, endLevel, null, this);
        this.game.physics.arcade.overlap(this.player, bats, takeDmgX, null, this);
        this.game.physics.arcade.collide(this.player, spikes, takeDmgFatal, null, this);
        this.game.physics.arcade.collide(this.player, fireballs, takeDmgX, null, this);

        this.BatFlying();

        
        function endLevel(player, endpos)
        {
            
            music.pause();
            if (level == 3)
            {
                level = 1;
                this.game.state.start("Win");
                score = 0;
                timecounter = 0;
            }
            else
            {

            level++;
            this.game.state.start('TheGame', true, false);
            }

        }






        function takeDmgFatal(player, danger)
        {

            
            var live = lives.getFirstAlive();

            if (live) {
                live.kill();
                //fataldmg
                this.player.health = 0;
                 
            }
            this.player.body.velocity.y = -150;

      
            
        }

        if (this.player.health <= 0)
        {

            this.game.state.start("GameOver");
            music.pause();
            score = 0;
            timecounter = 0;

            //this.player.kill();
            //this.player = new Player(this.game, 80, 368 - 64);
            //this.game.camera.follow(this.player);
            //this.player.health = 3;
            //this.UpdateHp();
        }

        function takeDmgX(player, danger)
        {            
            
            var live = lives.getFirstAlive();


            if (deathcounter > 1)
            {
                if (live)
                {
                    live.kill();
                    player.body.velocity.x = -danger.body.velocity.x
                    player.body.velocity.y = -danger.body.velocity.y
                    //loselife
                    this.player.health--;

                }
                deathcounter = 0;
                
            }
            

        }

        function collectGranade(player, pickup) {
            //ta bort
            pickup.kill();

            //lägger till score
            score += 10;
            granadeCount = granadeCount + 1;
            scoreText.text = 'Score:' + score;
        }

        function collectShuriken(player, item) {
            //ta bort
            item.kill();
            weaponShurikens.createMultiple(3, 'items1', 4);
            
            //lägger till score
            score += 10;
            //shurikenCount = shurikenCount + 1;
            scoreText.text = 'Score:' + score;
        }

        function collectfood(player, food) {
            //ta bort
            food.kill();

            //lägger till score
            score += 10;
            scoreText.text = 'Score:' + score;
        }
        function collectFlyingPotion(player,item)
        {
            item.kill();
            player.body.gravity.y = 100;
            canFly = true;
            currentFlyTime = this.game.time.now;

        }

        if (canFly == true && this.game.time.now > currentFlyTime + 10000)
        {
            canFly = false;
            this.player.body.gravity.y = 400;

        }
        //this.UpdateHp();nd

        //booms.forEach(function (boom) {
        //    if (boom.animations.currentAnim.frame == 3)
        //    {
        //        boom.body = null;
        //        boom.destroy();
        //    }
        //},
        //this);

        lavasbot.forEach(function (lava) {
            lava.animations.play('moving');
        },
        this);
        lavastop.forEach(function (lava) {
            lava.animations.play('moving');

        },
        this);

//        weaponGranades.forEach(function (weaponGranade) {

//            if (weaponGranade.body.velocity > 0) {
//                weaponGranade.body.angularVelocity = 500;
//            }
//            else if (weaponGranade.body.angularVelocity < 0) {
//                weaponGranade.body.angularVelocity = -500;
//            }

//        },
//this);


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

        //        booms.forEach(function (boom)
        //        {
        //            boom.animations.add('boom', [0, 1, 2, 3, 2, 1, 0], true);

        //        },
        //this);

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
