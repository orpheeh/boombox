module.exports = class  Player {

    constructor(pseudo, sid, game){
        this.pseudo = pseudo;
        this.sid = sid;
        this.game = game;
        this.score = 0;
    }

    play(combinaison){
      this.game.play(combinaison);
    }
}