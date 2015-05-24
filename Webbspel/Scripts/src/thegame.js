//VERSION 0.9//
 //senast ändrad 2015-05-23 av Adam//
//Checka Script/phaser.min.js eller kolla på https://phaser.io/docs //

var theGame = function (game) { };

'use strict';

var Player = function (game, x, y)
{
    //spelaren skapas i konstruktor med all data den behöver.
    Phaser.Sprite.call(this, game, x, y, 'bear');

    //fysik funkar
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    
    //all data till spelaren
    this.maxVelocityX = 200;
    this.maxVelocityY = 300;
    this.health = 3;
    this.body.setSize(25, 64, 0, 0);

    this.body.gravity.y = 400;

    // Sätter ankarpunkt i centrum
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('walk', [1, 2, 3, 4, 5], 12, true);
    this.body.tilePadding.set(32);
    this.game.add.existing(this);

};

//behövs för att den ska skapas korrekt
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
;

var player = this.player;

//KEYBINDS
var cursors;
var tossgranadeButton;
var tossshurikenButton;

//screenbuttons
var pauseKey;

//SCORE
var score = 0;
var scoreText;
//TEXT//
var hpText;
var granadeText;
var shurikenText;


//counters
var timecounter = 0;
var deathcounter = 2;
var granadeCount = 0;
var shurikenCount = 0;
var flyingPotionCount = 0;

//animation
var batAni;

//MAP DATA
var map;
var backgroundlayer;
var groundlayer;
var foregroundlayer;
var level = 1;

//några bools
var canFly = false;
var flag = true;
var justPressed = false;
var bossAttacked = false;


//boss startspeed
var bossSpeed;


///PLATFORMSRIKTNING//
var platformDir = -1;


//TIMERS//
var platformTimer;
var potionTimer = 0;
var currentFlyTime;
var worldTimer;

//ALLA MAPOBJEKT
var platforms;
var bosses;
var pickups;
var shurikens;
var granades;
var flyingpotions;
var lives;
var booms;
var pickups;
var spikes;
var lavastop;
var lavasbot;
var fireballs;
var bats;
var enemies;
var ends;
var hp;
var crates;

//filterdata
var filter1;
var filter2;
var filter3;
var sprite;



///MUSIK///
var music;

//vapentimers
var grandeTimer = 0;
var shurikenTimer = 0;

//weapons//
var weaponGranades;
var weaponShurikens;



theGame.prototype = {

    create: function () {
        
        //physics+bgcolor //ADAM
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#000000';



        //Sätter in bakgrundsfiltert//ADAM
        this.BackgroundFilter();


        //Laddar in olika data för olika banor// ADAM 2015-05-20
        if (level == 1)

        {
            //score/tid ska vara 0 när man börjar om//

            score = 0;
            timecounter = 0;
            map = this.game.add.tilemap('map');
            music = this.game.add.audio("music1");

            //sätter bakgrundlagert
            backgroundlayer = map.createLayer('background');

            //fixad spelarposition, vet ej hur ska fixa till tilemapen. 
            this.player = new Player(this.game, 80, 368 - 64);
            this.game.camera.follow(this.player);

            //sätter bakgrundfilter
            sprite.filters = [filter1];

        }

        if (level == 2) {
            music = this.game.add.audio("music2");
            map = this.game.add.tilemap('map2');
            //fixad spelarposition, vet ej hur ska fixa till tilemapen. 
            this.player = new Player(this.game, 16, 1568- 64);
            this.game.camera.follow(this.player);

            //sätter bakgrundfilter
            sprite.filters = [filter2];

        }

        if (level == 3) {
            music = this.game.add.audio("music3");
            map = this.game.add.tilemap('map3');
            //fixad spelarposition, vet ej hur ska fixa till tilemapen. 
            this.player = new Player(this.game, 16, 656 - 64);
            this.game.camera.follow(this.player);

            //sätter bakgrundfilter
            sprite.filters = [filter3];


        }

        //Music
        music.play('', 0, 1, true);
        music.onLoop.add(this.playLevelMusic, this);
        
        //DATA SOM BEHÖVS TILL MAPS//
        map.addTilesetImage('tiles2');
        map.addTilesetImage('tiles2dark');
        map.addTilesetImage('tree');
        map.addTilesetImage('tiles1');
        map.addTilesetImage('moveplatform');
        map.addTilesetImage('lava');
        map.addTilesetImage('bat');
        map.addTilesetImage('boss');

        //Sätter groundlayer//DETTA ÄR LAGERT MAN GÅR PÅ//
        groundlayer = map.createLayer('ground');
        map.setCollisionBetween(1, 1000, true, 'ground');
        groundlayer.resizeWorld();
        groundlayer.enableBody = true;

        this.CreateObjects();
    
        //Sätter främre lagert
        foregroundlayer = map.createLayer('foreground');

        this.PlatformTimer();

        //granades TEXT
        granadeText = this.game.add.text(16,96, '', { font: "20px Arial", fill: '#003000'})
        granadeText.fixedToCamera = true;
        granadeText.text = 'Granades:' + granadeCount;
        
        //shurikens TEXT
        shurikenText = this.game.add.text(16, 96+ 32, '', { font: "20px Arial", fill: '#009000' })
        shurikenText.fixedToCamera = true;
        shurikenText.text = 'Shurikens:' + shurikenCount;

        //score TEXT
        scoreText = this.game.add.text(16, 16, '', { font: "40px Arial", fill: '#fff' });
        scoreText.fixedToCamera = true;
        scoreText.text = 'Score:' + score;


        this.UpdateHp();

        ////pausar spelet och timern
        pauseKey = this.game.add.sprite(800 - 48, 600 - 80, 'PLAYPAUSE', 1);
        pauseKey.fixedToCamera = true;
        pauseKey.inputEnabled = true;
        pauseKey.events.onInputUp.add(function () {
            this.game.paused = true;
        }, this);
        this.game.input.onDown.add(function () {
            if (this.game.paused)
            {
                pauseKey.loadTexture('PLAYPAUSE', 1);
                this.game.paused = false;
            }
            else if (this.game.paused == false)
                pauseKey.loadTexture('PLAYPAUSE', 0);

        }, this);

        //Pausar musiken//
        PauseButton = this.game.add.button(800 - 48, 600 - 32, "PLAYPAUSE", this.pauseMusicFunction, this, 2, 3);
        PauseButton.fixedToCamera = true;

        ////SÄTTER DE OLIKA TIMERS////ADAM
        worldTimer = this.game.add.text(800-64, 32, '0');
        worldTimer.fixedToCamera = true;
        currentTimer = this.game.time.create(false);
        currentTimer.loop(1000, this.updateTimer, this);
        currentTimer.start();
    },

    pauseMusicFunction: function () {

        if (this.game.paused == false)
        {
            if (flag)
            {
                music.pause();
            }
            else
            {
                music.resume();
            }

        flag = !flag;
        }


    },

    updateTimer: function () {
        //oilka timers
        deathcounter++;
        timecounter++;
        worldTimer.setText(timecounter);
    },

    UpdateHp: function()
    {
       ///Sätter liv till spelarens liv/// skapar sprites för liven i hörnet
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
        //DETTA ÄR EN DÅLIG LÖSNING HAR JAG KOMMIT FRAM TILL, SKA ÄNDRAS!// adam 2015-04-17
        platformTimer = this.game.time.create(false);

        //  saker händer efter 2 sekunder sen körs funktion
        platformTimer.loop(2000, ChangePlatformDir, this);

        platformTimer.start();



        function ChangePlatformDir()
        {
            platformDir = -1 * platformDir;
        
        }

    },

    CreateObjects: function()
    {
        //gör till en grupp som kan ha spelarens liv som egna objekt.
        lives = this.game.add.group();

        //granades
        // granatgruppen //OBS DESSA ÄR FÖR DE VAPEN SOM MAN KASTAR!// ADAM
        weaponGranades = this.game.add.group();
        weaponGranades.enableBody = true;
        weaponGranades.physicsBodyType = Phaser.Physics.ARCADE;
        weaponGranades.setAll('outOfBoundsKill', true);
        weaponGranades.setAll('checkWorldBounds', true);

        //shurikens
        // shurikengruppen //OBS DESSA ÄR FÖR DE VAPEN SOM MAN KASTAR!// ADAM
        weaponShurikens = this.game.add.group();
        weaponShurikens.enableBody = true;
        weaponShurikens.physicsBodyType = Phaser.Physics.ARCADE;
        weaponShurikens.createMultiple(10, 'items1', 4);
        weaponShurikens.setAll('anchor.x', -0.5);
        weaponShurikens.setAll('anchor.y', 1);
        weaponShurikens.setAll('outOfBoundsKill', true);
        weaponShurikens.setAll('checkWorldBounds', true);

        //dessa nedan tilldelar grupper till dessa variabler och en kropp så de kan interagera med varandra.
        bats = this.game.add.group();
        bats.enableBody = true;

        booms = this.game.add.group();
        booms.enableBody = true;

        bosses = this.game.add.group();
        bosses.enableBody = true;

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


        //Dessa nedan bestämmer var och hur objekt ska skapas från JSON filer.
        //bosses
        map.createFromObjects('enemies', 492, 'boss', 0, true, false, bosses);

        //shurikens
        map.createFromObjects('objects', 205, 'items1', 4, true, false, shurikens);
        //bats
        map.createFromObjects('enemies', 446, 'bat', 0, true, false, bats);
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
        map.createFromObjects('danger', 427, 'lava', 3, true, false, lavastop);
        map.createFromObjects('danger', 436, 'lava', 6, true, false, lavasbot);

        //bats gör....
        bats.forEach(function (bat)
        {            
        batAni = bat.animations.add('wake', [0, 1, 2, 3, 4, 5], 6, false);
        batAni = bat.animations.add('fly', [6, 7, 8, 9], 12, true);
        bat.body.tilePadding.set(32);
        },
        this);

        //Alla bossar har...
        bosses.forEach(function (boss)
        {
            bossAttacked = false;
            boss.HP = 7;
            boss.score = 150;
            boss.animations.add('move', [0, 1, 2], 4);
            boss.body.gravity.y = 400;
            bossSpeed = 50;
            boss.anchor.setTo(0.5, 0.5);
        },
        this);

        //lava tiles gör detta....
        lavastop.forEach(function (lava)
        {
            lava.animations.add('moving', [3, 4, 5], 2, true);
            lava.body.tilePadding.set(32);
            lava.body.immovable = true;
        },
        this);

        lavasbot.forEach(function (lava)
        {
            lava.animations.add('moving', [6, 7, 8], 2, true);
            lava.body.tilePadding.set(32);
            lava.body.immovable = true;
        },
        this);

    },


    tossShuriken: function ()
    {
        
        //  så att man inte kan kasta för fort finns den en tidsbegränsning...
        if (this.game.time.now > shurikenTimer && shurikenCount > 0)
        {
            //  tar den första som finns i gruppen...
            weaponShuriken = weaponShurikens.getFirstExists(false);

            weaponShurikens.forEach(function (shuriken)
            {
                shuriken.body.collideWorldBounds = true;
                shuriken.anchor.setTo(0.5, 0.5);

            },
            this);
            
            if (weaponShuriken)
            {
                //  Kastar den!
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
            shurikenCount--;
        }
        shurikenText.text = 'Shurikens:' + shurikenCount;
    },

    tossGranade: function ()
    {
        //  så att man inte kan kasta för fort finns den en tidsbegränsning...
        if (this.game.time.now > grandeTimer && granadeCount > 0)
        {
            
            //skapar en granat//
            weaponGranade = weaponGranades.create(0, 0, 'items1', 2);

            
            weaponGranades.forEach(function (weaponGranade)
            {
                weaponGranade.anchor.setTo(0.5, 0.5);

                this.game.time.events.add(Phaser.Timer.SECOND * 3, function ()
                {
                    
                    justPressed = false;
                    bats.forEach(function (bat) {
                        ///dom dödar bats///
                        if (Phaser.Math.distance(weaponGranade.x, weaponGranade.y, bat.x, bat.y) <= 150)
                        {
                            bat.kill();

                        }

                    },
this);

                    bosses.forEach(function (b)
                    {
                        ///dom dödar bossar///
                        if (Phaser.Math.distance(weaponGranade.x, weaponGranade.y, b.x, b.y) <= 150)
                        {
                            b.kill();

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

             //  Kastar granat
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
            granadeCount = granadeCount - 1;
            granadeText.text = 'Granade:' + granadeCount;
        }
          
},

    KeyControllers: function ()
    {
        cursors = this.game.input.keyboard.createCursorKeys();
        tossgranadeButton = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
        tossshurikenButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        if(deathcounter > 1)
            this.player.body.velocity.x = 0;

        if (tossgranadeButton.isDown && justPressed == false)
        {
          
            this.tossGranade();
            justPressed = true;
        }
        if (tossshurikenButton.isDown)
        {

            this.tossShuriken();
        }
           

        if (cursors.up.isDown && canFly == true)
        {

            this.player.body.velocity.y = -this.player.maxVelocityX;

        }

        if (cursors.down.isDown && canFly == true)
        {

            this.player.body.velocity.y = this.player.maxVelocityX;

        }
        if (cursors.left.isDown && deathcounter > 1)
        {
            
            this.player.scale.x = -1;
            this.player.body.velocity.x = -this.player.maxVelocityX;
            this.player.animations.play('walk');

        }
        else if (cursors.right.isDown && deathcounter > 1)
        {
            this.player.scale.x = 1;

            this.player.body.velocity.x = this.player.maxVelocityX;
            this.player.animations.play('walk');

        }
        else
        {
            this.player.frame = 0;
        }

        if (cursors.up.isDown && this.player.body.onFloor() && deathcounter > 1 || cursors.up.isDown && this.player.body.touching.down && deathcounter > 1)
        {
            this.player.body.velocity.y = -this.player.maxVelocityY;
        }
    },

    BossAttack: function ()
    {
        bosses.forEach(function (boss)
        {
            if (bossAttacked == true)
            {
                if (boss.body.onFloor())
                {
                    if (this.player.x < boss.x)
                    {
                        bossSpeed = -150;
                        boss.scale.x = 1;
                    }
                    else if (this.player.x > boss.x)
                    {
                        bossSpeed = 150;
                        boss.scale.x = -1;
                    }
                }
                boss.animations.play('move');
                boss.body.velocity.x = bossSpeed;
            }

               
            boss.body.bounce.set(1);
            if (Phaser.Math.distance(this.player.x, this.player.y, boss.x, boss.y) <= 400 && boss.body.velocity.x == 0)
            {
                //detta körs när spelaren går nära boss
                bossAttacked = true;
                boss.body.velocity.y = -300;
                

            }

        },
this);
    },

    BatFlying: function()
    {
        bats.forEach(function (bat)
        {

            ///bats studsar på väggen.
            bat.body.bounce.set(1);
            if (Phaser.Math.distance(this.player.x, this.player.y, bat.x, bat.y) <= 200 && bat.body.velocity.y == 0 && bat.body.velocity.x == 0)
            {
                //detta körs när spelaren går nära bats
                bat.animations.play('fly')
                bat.body.velocity.y = this.game.rnd.integerInRange(-100, 100);
                bat.body.velocity.x = this.game.rnd.integerInRange(-100, 100);
                

            }

        },
this);
    },




    update: function ()
    {

        //UPPDATERAR FILTER FÖR DIVERSE BANA//
        if (level == 1)
            filter1.update();
        else if (level == 2)
            filter2.update();
        else if (level == 3)
            filter3.update();


        
        //hpText.text = this.player.health;
        //KOLLISION KÖRS FÖR 2 OBJEKT, SEDAN KÖRS EN FUNKTION OM SÅ VILL//
        this.game.physics.arcade.collide(this.player, platforms);
        this.game.physics.arcade.collide(weaponShurikens,groundlayer,killThis,null,this);
        this.game.physics.arcade.collide(bosses, groundlayer);
        this.game.physics.arcade.collide(this.player, bosses);
        this.game.physics.arcade.collide(this.player, crates);
        this.game.physics.arcade.collide(crates, groundlayer);
        this.game.physics.arcade.collide(fireballs, lavasbot);
        this.game.physics.arcade.collide(this.player, groundlayer);
        this.game.physics.arcade.collide(this.player, lavasbot, takeDmgFatal, null, this);
        this.game.physics.arcade.collide(this.player, bosses, takeDmgFatal, null, this);
        this.game.physics.arcade.collide(this.enemy, groundlayer);
        this.game.physics.arcade.collide(weaponGranades, groundlayer);
        //ÖVERLAPPNING KÖRS FÖR 2 OBJEKT, SEDAN KÖRS EN FUNKTION OM SÅ VILL//
        this.game.physics.arcade.overlap(bats,groundlayer);
        this.game.physics.arcade.overlap(weaponShurikens, bosses, dealDmg, null, this);
        this.game.physics.arcade.overlap(weaponShurikens, bats, killEnemy, null, this);
        this.game.physics.arcade.overlap(this.player, pickups, collectfood, null, this);
        this.game.physics.arcade.overlap(this.player, shurikens, collectShuriken, null, this);
        this.game.physics.arcade.overlap(this.player, flyingpotions, collectFlyingPotion, null, this);
        this.game.physics.arcade.overlap(this.player, granades, collectGranade, null, this);
        this.game.physics.arcade.overlap(this.player, ends, endLevel, null, this);
        this.game.physics.arcade.overlap(this.player, bats, takeDmgX, null, this);
        this.game.physics.arcade.collide(this.player, spikes, takeDmgFatal, null, this);
        this.game.physics.arcade.collide(this.player, fireballs, takeDmgX, null, this);

        this.BatFlying();
        this.BossAttack();
        
        function killThis(weapon, object)
        {
            //dödar ett objekt
            weapon.kill();
        }

        function endLevel(player, endpos)
        {
            //körs i slutet av banor
            music.pause();
            if (level == 3)
            {
                level = 1;

                this.game.state.start("Win", true, false, score);
                timecounter = 0;
            }
            else
            {

                level++;
                this.player.body.collideWorldBounds = false;
            this.game.state.start("TheGame");
            }

        }

        function dealDmg(weapon, enemy)
        {
            //skadar en fiende med liv, ger poäng//ADAM fix 2015-05-22
            enemy.HP--;
            weapon.kill();

            if (enemy.HP == 0)
            {
                enemy.kill();
                score = score + enemy.score;
                scoreText.text = 'Score:' + score;
            }



        }

        function killEnemy(weapon, enemy)
        {
            enemy.kill();
            //ger 15 poäng och dödar fiende//
            score = score + 15;
            scoreText.text = 'Score:' + score;
            

        }



        function takeDmgFatal(player, danger)
        {

            
            var live = lives.getFirstAlive();

            if (live)
            {
                live.kill();
                //spelaren dör direkt// adam
                this.player.health = 0;
                 
            }
            this.player.body.velocity.y = -150;

      
            
        }

        if (this.player.health <= 0)
        {
            //gameover körs när man dör
            this.game.state.start("GameOver",true,false, score);
            music.pause();
            score = 0;
            timecounter = 0;
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
                    //tappar liv// adam
                    this.player.health--;

                }
                deathcounter = 0;
                
            }
            

        }

        function collectGranade(player, pickup)
        {
            //ta bort
            pickup.kill();

            // ADAM 2015-04-19
            granadeCount = granadeCount + 1;
            granadeText.text = 'Granade:' + granadeCount;
        }

        function collectShuriken(player, item)
        {
            // ADAM 2015-04-19
            //tar bort item
            item.kill();
            shurikenCount = shurikenCount + 1;
            shurikenText.text = 'Shurikens:' + shurikenCount;
        }

        function collectfood(player, food)
        {
            //ta bort
            food.kill();

            //ADAM 2015 - 04 - 19
            //lägger till score
            score += 10;
            scoreText.text = 'Score:' + score;
        }
        function collectFlyingPotion(player,item)
        {
           // ADAM 2015 - 04 - 22
            item.kill();
            player.body.gravity.y = 100;
            canFly = true;
            currentFlyTime = this.game.time.now;

        }

        
        if (canFly == true && this.game.time.now > currentFlyTime + 6000)
        {
            ///du kommer kunna flyga 6 sekunder sen sätter denna metoden dig normal igen/// Adam 2015-04-22
            canFly = false;
            this.player.body.gravity.y = 400;

        }

        //det finns 2 lavatyper en för toppen och en för botten.
        lavasbot.forEach(function (lava)
        {
            lava.animations.play('moving');
        },
        this);
        lavastop.forEach(function (lava)
        {
            lava.animations.play('moving');

        },
        this);

        //körs för varje eldboll //adam
        fireballs.forEach(function (fireball)
        {
            fireball.anchor.setTo(0.5, 0.5);
            fireball.body.gravity.y = 600;
            fireball.body.velocity.x = 0;
           
            //dom bytar håll beroende på hastighet
            if (fireball.body.velocity.y > 0)
            {
                fireball.scale.y = -1
            }
            else
                fireball.scale.y = 1


            if (fireball.body.touching.down)
            {
                //hastighet i y sätts till radom värde mellan ett interval. //adam 
                fireball.body.velocity.y = -(this.game.rnd.integerInRange(500, 600));
            }


        },
        this);

        //WB shurikenFIX// adam 2015-05-12
        weaponShurikens.forEach(function (shuriken)
        {

            if (shuriken.body.velocity.x == 0)
                shuriken.kill();
        },
        this);


        crates.forEach(function (crate)
        {
            crate.body.gravity.y = 400;

            //detta gör så man kan putta på lådor// adam
            if (crate.body.touching.left == false || crate.body.touching.right == false)
            {                
                crate.body.velocity.x = 0;
            }
            
    
        },
        this);

        platforms.forEach(function (platform)
        {
            //platformar ska inte vara beroende av annat så ....
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


    ///DETTA ÄR FÖR ATT RENDERA HITBOX FÖR SPELAREN FÖR DEBUG///
    //render: function () {
    //    this.game.debug.body(this.player, 'rgba(0, 255, 0, 0.9)');
    //},

    BackgroundFilter: function()
{
        ///DETTA ÄR BAKGRUNDSFILTER/// ändrad av adam 2015-05-20
        // Från http://glslsandbox.com/

    var fragmentSrc1 = [
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
        "vec2 pos_ = pos + time * 0.09;",
        "float seed = 0.0;",
        "float freq_start = 1.5;",
        "float amp_start = 1.0;",
        "float amp_ratio = 0.35;",
        "float pn = perlin_noise(pos_, seed, freq_start, amp_start, amp_ratio);",

   " #if 1",
        "// smoke",
        "gl_FragColor = vec4(pn * 1.0, pn * 1.0, pn * 0.8, 1.0);",
    "#else",
        "// dizzy!!!",
        "pn = fract(pn * 8.0 + sin(time));",
        "gl_FragColor = vec4(pn * 2.0, pn * 1.0, pn * 0.2, 1.0);",
    "#endif",
    "}",
    ];

    var fragmentSrc2 = [
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
            "freq *= 1.6;",
            "amp *= _amp_ratio;",
            "pn += (noise(_pos, _seed, vec2(freq, freq)) * 2.0 - 1.0) * amp;",
        "}",
        "return pn;",
    "}",

    "void main( void )",
    "{",
        "// position",
        "vec2 pos = (gl_FragCoord.xy / resolution - 0.8) * 2.0;",
        "float a = resolution.x / resolution.y;",
        "pos.x *= a;",

        "// perlin_noise",
        "vec2 pos_ = pos + -time * 0.09;",
        "float seed = 0.0;",
        "float freq_start = 1.5;",
        "float amp_start = 1.0;",
        "float amp_ratio = 0.35;",
        "float pn = perlin_noise(pos_, seed, freq_start, amp_start, amp_ratio);",

   " #if 1",
        "// smoke",
        "gl_FragColor = vec4(pn * 1.3, pn * 1.0, pn * 1.0, 1.0);",
    "#else",
        "// dizzy!!!",
        "pn = fract(pn * 8.0 + sin(-time));",
        "gl_FragColor = vec4(pn * 2.0, pn * 1.0, pn * 0.2, 1.0);",
    "#endif",
    "}",
    ];

    var fragmentSrc3 = [
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
"vec2 pos_ = pos + time * 0.6;",
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
"pn = fract(pn * 10.0 + sin(time));",
"gl_FragColor = vec4(pn * 3.0, pn * 1.0, pn * 0.2, 1.0);",
"#endif",
"}",
    ];

    filter1 = new Phaser.Filter(this.game, null, fragmentSrc1);
    filter1.setResolution(800, 600);

    filter2 = new Phaser.Filter(this.game, null, fragmentSrc2);
    filter2.setResolution(800, 600);

    filter3 = new Phaser.Filter(this.game, null, fragmentSrc3);
    filter3.setResolution(800, 600);

    sprite = this.game.add.sprite();
    sprite.width = 800;
    sprite.height = 600;

}


}
