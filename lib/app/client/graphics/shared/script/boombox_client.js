class BoomBoxClient {

    constructor(param){
        this.socket = null;
        this.sid = null;
        this.current = null;
        this.index = null;
        this.gameId = null;
        this.myProposition = "";
        this.combinaison = "";
        this.i = 0;
        this.pseudo = "";
        this.buttons = document.querySelectorAll(".play-button");
        this.interval = null;

        this.onWait = param.onWait;
        this.onGame = param.onGame;
        this.onRestart = param.onRestart;
        this.onWin = param.onWin;
        this.onLose = param.onLose;
        this.onAnimEnd = param.onAnimEnd;

    }

    connect(){
        this.socket = io.connect();

        this.socket.on("connect", () => {
            this.sid = this.socket.id;

            this.socket.on("wait_adversaire", (data) => {
                this.index = data.index;
                this.gameId = data.gameId;
                this.onWait(data)
            })
        
            this.socket.on("game", (data) => {
                this.current = data.current;
                this.index = data.index;
                this.onGame(data);
                this.myProposition = "";
                this.showCombinaison(data.combinaison);
            });
        
            this.socket.on("restart", (data) => {
                this.current = data.current;
                this.index = data.index;
                this.combinaison = data.combinaison;
                this.onRestart(data)
                if(data.youLose){
                    this.onLose(data)
                } else {
                    this.onWin(data)
                }
                this.showCombinaison(data.combinaison);
            });
        });
    }

    showCombinaison(c) {
        this.combinaison = c;
        this.i = 0;
        this.interval = setInterval(() => this.animate(), 1000);
    }
    
    animate() {
        if (this.i < this.combinaison.length) {
            const letter = this.combinaison.charAt(this.i);
            console.log(this.buttons.length);
            this.buttons.forEach(button => button.classList.remove("play"));
            for (let j = 0; j < this.buttons.length; j++) {
                if (this.buttons[j].classList.contains(letter)) {
                    this.buttons[j].classList.add("play");
                }
            }
        }
        this.i++;
        if (this.i > this.combinaison.length) {
            this.buttons.forEach(button => button.classList.remove("play"));
            this.onAnimEnd();
            clearInterval(this.interval);
        }
    }
    
    createGame(pseudo) {
        this.pseudo = pseudo;
        const sid = this.socket.id;
        this.socket.emit("create_game", { sid, pseudo });
    }
    
    joinGame(pseudo, gameId) {
        this.pseudo = pseudo;
        this.gameId = gameId;
        const sid = this.socket.id;
        this.socket.emit("join_game", { sid, pseudo, gameId });
    
    }
    
    play(letter) {
        if(this.current == this.index){
            if(this.myProposition.length < this.combinaison.length+1){
                this.myProposition += letter;
            }
            if(this.myProposition.length > this.combinaison.length) {
                const gameId = this.gameId;
                this.socket.emit("play", { index: this.index, combinaison: this.myProposition, gameId });
                this.myProposition = "";
                return true;
            } else {
                return false;
            }
        }
    }
}