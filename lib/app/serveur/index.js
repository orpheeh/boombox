
module.exports = (server) => {

    const socketIO = require("socket.io");
    const io = socketIO(server, {
        cors: {
          origin: "http://boombox.orpheenve.xyz",
          methods: ["GET", "POST"]
        }
      });

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}