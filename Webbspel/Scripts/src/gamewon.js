//av Adam 0.2
var win = function (game) { }
var gameScore;
win.prototype = {
    
    init: function (score) {
        alert("You scored: " + score)
        //skriver score till en variabel.
        gameScore = score;
    },

    create: function () {
        var gameOverTitle = this.game.add.sprite(400, 160, "wingame");
        gameOverTitle.anchor.setTo(0.5, 0.5);
        var playButton = this.game.add.button(400, 320, "play", this.playTheGame, this);
        playButton.anchor.setTo(0.5, 0.5);
    },
    playTheGame: function () {
        this.game.state.start("TheGame");
    }
}