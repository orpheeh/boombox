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
        const user = users.find(u => u.sid == sid);
        if(user){
            const player = new Player(pseudo, user.sid);
            const id = uuidv4().toString().substring(0, 13);
            const game = new Game(player, id);
            this.games.push(game);
            return game;
        }
        return null;
    }

    joinGame(sid, pseudo, id){
        const user = users.find(u => u.sid == sid);
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
            return { playerIndex, result };
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
                socket.broadcast.to(sid).emit("wait_adversaire", { gameId: game.id, index: 0 } );
            });
    
            socket.on("join_game", (data) => {
                const sid = data.sid;
                const pseudo = data.pseudo;
                const game = this.joinGame(sid, pseudo);
                const sid1 = game.players[0].sid;
                const sid2 = game.players[1].sid;
                socket.broadcast.to(sid1).emit("game", { gameId: game.id, index: 0, current: game.currentPlayerIndex, malus: false, combinaison: this.combinaison } );
                socket.broadcast.to(sid2).emit("game", { gameId: game.id, index: 1, current: game.currentPlayerIndex, malus: false, combinaison: this.combinaison } );
            });
    
            socket.on("play", (data) => {
                const index = data.index;
                const gameId = data.gameId;
                const combinaison = data.combinaison;
                const result = this.playGame(gameId, index, combinaison);
                const monsid = game.players[index].sid;
                const autresid = game.players[1-index].sid;
                if(result){
                    socket.broadcast.to(monsid).emit("game", { gameId: game.id, index: index, current: game.currentPlayerIndex, malus: false, combinaison: game.combinaison } );
                    socket.broadcast.to(autresid).emit("game", { gameId: game.id, index: 1-index, current: game.currentPlayerIndex, malus: false, combinaison: game.combinaison } );
                } else {
                    socket.broadcast.to(monsid).emit("restart", { gameId: game.id, index: index, current: game.currentPlayerIndex, malus: false, combinaison: game.combinaison, youLose: true } );
                    socket.broadcast.to(autresid).emit("restart", { gameId: game.id, index: 1-index, current: game.currentPlayerIndex, malus: false, combinaison: game.combinaison, youLose: false } );
                }
            });
        });
    }
}