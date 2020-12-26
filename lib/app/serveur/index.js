
module.exports = (server) => {

    const socketIO = require("socket.io");
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}