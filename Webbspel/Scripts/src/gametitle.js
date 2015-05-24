//speltitelen av Adam v0.1
var gameTitle = function (game) { }

gameTitle.prototype = {

    create: function ()
    {
		var gameTitle = this.game.add.sprite(400,120,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.button(400,320,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
	},
    playTheGame: function ()
    {
		this.game.state.start("TheGame");
	}
}