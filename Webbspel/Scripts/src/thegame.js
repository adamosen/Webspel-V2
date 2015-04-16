var theGame = function (game)
{
    var player;
    var cursors;
    var pickups;
    var food;
    var score = 0;
    var scoreText;
    var map;
    var backgroundlayer;
    var groundlayer;

	//spriteNumber = null;
	//number = 0;
	//workingButtons = true;
	//higher = true;
	//score = 0;
}

theGame.prototype = {

    create: function ()
    {
        //physics+bgcolor
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#33CCFF';
        ////map
        map = this.game.add.tilemap('map');
        map.addTilesetImage('tiles2');
        map.addTilesetImage('tree');
        map.addTilesetImage('items');
        ////groundlayer
        //groundlayer = map.createLayer('ground');
        //groundlayer.resizeWorld();
        //groundlayer.enableBody = true;
        ////player
        //player = this.game.add.sprite(32, game.world.height, 'bear');
        //this.game.physics.arcade.enable(player);
        //this.game.camera.follow(player);
        //player.body.collideWorldBounds = true;
        //player.animation.add('left', [1, 2, 3, 4, 5], 10, true);
        //player.animation.add('right', [5, 4, 3, 2, 1], 10, true);
        ////pickups
        //map.setCollisionBetween(1, 100);

		//number = Math.floor(Math.random()*10);
		//spriteNumber = this.game.add.sprite(400,240,"numbers");
		//spriteNumber.anchor.setTo(0.5,0.5);
		//spriteNumber.frame = number;	
		//var higherButton = this.game.add.button(400,100,"higher",this.clickedHigher,this);
		//higherButton.anchor.setTo(0.5,0.5);
		//var lowerButton = this.game.add.button(400,380,"lower",this.clickedLower,this);
		//lowerButton.anchor.setTo(0.5,0.5);	
	}
	//clickedHigher: function(){
	//	higher=true;
	//	this.tweenNumber(true);
	//},
	//clickedLower: function(){
	//	higher=false;
	//	this.tweenNumber(false);
	//},
	//tweenNumber: function(higher){
	//	if(workingButtons){
	//		workingButtons=false;
	//		var exitTween = this.game.add.tween(spriteNumber);
	//          exitTween.to({x:420},500);
	//          exitTween.onComplete.add(this.exitNumber,this);
	//          exitTween.start();
	//     }
	//},
	//exitNumber: function(){
	//	spriteNumber.x = -180;
	//     spriteNumber.frame = Math.floor(Math.random()*10);
	//     var enterTween = this.game.add.tween(spriteNumber);
	//     enterTween.to({x:160},500);
	//     enterTween.onComplete.add(this.enterNumber,this);
	//     enterTween.start();
	
	//},
	//enterNumber: function(){
	//	workingButtons=true;
	//	if((higher && spriteNumber.frame<number)||(!higher && spriteNumber.frame>number)){
	//		this.game.state.start("GameOver",true,false,score);	
	//	}
	//	else{  
	//		score++;
	//		number = spriteNumber.frame;
	//	}	
	//}
}