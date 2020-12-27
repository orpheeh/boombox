const Game = require("../entities/game");
const Player = require("../entities/player");
const User = require("../entities/user");

const { v4: uuidv4 } = require('uuid');


module.exports = class {

    constructor(io){
        this.users = [];
        this.games = [];
        this.io = io;
    }

    createGame(sid, pseudo){
        const user = this.users.find(u => u.sid == sid);
        if(user){
            const player = new Player(pseudo, user.sid);
            const id = uuidv4().toString().substring(0, 8);
            const game = new Game(player, id);
            this.games.push(game);
            return game;
        }
        return null;
    }

    joinGame(sid, pseudo, gameId){
        const user = this.users.find(u => u.sid == sid);
        if(user){
            const player = new Player(pseudo, user.sid);
            const game = this.games.find(g => g.id == gameId);
            game.addPlayer(player);
            return game;
        } else {
            return null;
        }
    }

    createUser(sid){
        const user = new User(sid);
        this.users.push(user);
    }

    deleteUser(sid){
        for(let i = 0; i < this.users.length; i++){
            if(this.users[i].sid == sid){
                this.users.splice(i, 1);
            }
        }
    }

    playGame(gameId, playerIndex, combinaison){
        const game = this.games.find(g => g.id == gameId);
        if(game){
            const result = game.play(combinaison);
            return { playerIndex, result, game };
        } else {
            throw Exception(gameId + " Not exist");
        }
    }

    loop(){

        this.io.on("connection", (socket) => {
            const sid = socket.id;
            this.createUser(sid);
            
            socket.on('disconnect', () => {
                this.deleteUser(sid);
            });

            socket.on("create_game", (data) => {
                const sid = data.sid;
                const pseudo = data.pseudo;
                const game = this.createGame(sid, pseudo);
                console.log(sid);
                this.io.to(sid).emit("wait_adversaire", { gameId: game.id, index: 0 } );
            });
    
            socket.on("join_game", (data) => {
                const sid = data.sid;
                const pseudo = data.pseudo;
                const gameId = data.gameId;
                const game = this.joinGame(sid, pseudo, gameId);
                const sid1 = game.players[0].sid;
                const sid2 = game.players[1].sid;
                this.io.to(sid1).emit("game", { gameId: game.id, index: 0, current: game.currentPlayerIndex, malus: false, combinaison: game.combinaison, players: game.players  } );
                this.io.to(sid2).emit("game", { gameId: game.id, index: 1, current: game.currentPlayerIndex, malus: false, combinaison: game.combinaison, players: game.players } );
            });
    
            socket.on("play", (data) => {
                const index = data.index;
                const gameId = data.gameId;
                const combinaison = data.combinaison;
                console.log(data);
                const result = this.playGame(gameId, index, combinaison);
                const game = result.game;
                const monsid = game.players[index].sid;
                const autresid = game.players[1-index].sid;
                console.log(result);
                if(result.result){
                    this.io.to(monsid).emit("game", { gameId: game.id, index: index, current: game.currentPlayerIndex, malus: false, combinaison: game.combinaison, players: game.players } );
                    this.io.to(autresid).emit("game", { gameId: game.id, index: 1-index, current: game.currentPlayerIndex, malus: false, combinaison: game.combinaison, players: game.players } );
                } else {
                    this.io.to(monsid).emit("restart", { gameId: game.id, index: index, current: game.currentPlayerIndex, malus: false, combinaison: game.combinaison, youLose: true, monscore: game.players[index].score, autrescore: game.players[1-index].score } );
                    this.io.to(autresid).emit("restart", { gameId: game.id, index: 1-index, current: game.currentPlayerIndex, malus: false, combinaison: game.combinaison, youLose: false, monscore: game.players[1-index].score, autrescore: game.players[index].score } );
                }
            });
        });
    }
}