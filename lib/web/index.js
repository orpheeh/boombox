const express = require("express");
const path = require("path");

module.exports = () => {
    const app = express();

    const PORT = process.env.PORT || 3000;

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../app/client/index.html"));
    });

    app.listen(PORT, () => console.log("Boombox listenning at port " + PORT));
}