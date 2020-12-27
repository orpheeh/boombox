module.exports = class {

    constructor(player1, id){
        this.id = id;
        this.players = [ player1 ];
        this.currentPlayerIndex = 0;
        this.combinaison = "LRTB";
    }

    addPlayer(player){
        if(this.players.length < 2){
            this.players.push(player);
            this.restart();
        }
    }

    nextPlayer(){
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    }

    play(proposition){
        if(this.verify(proposition)){
            this.combinaison = proposition;
            this.nextPlayer();
            return true;
        } else {
            this.players[1 - this.currentPlayerIndex].score++;
            this.restart();
            return false;
        }
    }

    verify(proposition){
        const previous = proposition.substring(0, proposition.length-1);
        return previous == this.combinaison;
    }

    restart(){
        this.combinaison = "LRTB";
        this.currentPlayerIndex = 0;
    }
}