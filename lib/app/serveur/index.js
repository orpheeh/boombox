const GamePlay = require("./lib/rules/game_play"); 

module.exports = (server) => {

    const socketIO = require("socket.io");
    const io = socketIO(server, {
        cors: {
          origin: "http://boombox.orpheenve.xyz",
          methods: ["GET", "POST"]
        }
      });
    
    const gamePlay = new GamePlay(io);
    gamePlay.loop();
}