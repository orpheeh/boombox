const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const boomboxServer = require("../app/serveur");


module.exports = () => {
    const app = express();
    const server = http.createServer(app);

    boomboxServer(server);

    app.use(cors());
    app.use(express.static(path.join(__dirname, "../../node_modules/socket.io/client-dist")));
    app.use("/public", express.static(path.join(__dirname, "../app/client")));

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../app/client/graphics/screens/accueil/accueil.html"));
    });

    app.get("/test", (req, res) => {
        res.sendFile(path.join(__dirname, "../app/client/test/index.html"));
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log("Boombox listenning at port " + PORT));
}