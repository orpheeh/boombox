let socket = io.connect();
let sid = null;
let current = null;
let index = null;

socket.on("connect", () => {
    sid = socket.id;

    socket.on("wait_adversaire", (data) => {
        document.querySelector(".game").innerHTML = "Game ID: " + data.gameId;
        document.querySelector(".index").innerHTML = "Index: " + data.index;
    })

    socket.on("game", (data) => {
        current = data.current;
        index = data.index;
        document.querySelector(".game").innerHTML = "Game ID: " + data.gameId;
        document.querySelector(".index").innerHTML = "Index: " + data.index;
        document.querySelector(".adversaire").innerHTML = "Autre: " + data.players[1 - data.index].pseudo;
        document.querySelector(".combinaison").innerHTML = data.combinaison;
        if (data.current == data.index) {
            document.querySelector(".index").style.color = "green";
        } else {
            document.querySelector(".index").style.color = "black";
        }
        myProposition = "";
        showCombinaison(data.combinaison);
    });

    socket.on("restart", (data) => {
        current = data.current;
        index = data.index;
        document.querySelector(".combinaison").innerHTML = data.combinaison;
        if (data.current == data.index) {
            document.querySelector(".index").style.color = "green";
        } else {
            document.querySelector(".index").style.color = "black";
        }
        document.querySelector(".moi").innerHTML = data.monscore;
        document.querySelector(".autre").innerHTML = data.autrescore;
        combinaison = data.combinaison;
        if(data.youLose){
            alert("Tu as perdu cette battaille");
        } else {
            alert("Tu as gagne cette battaille");
        }
    });
});

let currentLetter = 0;
let buttons = document.querySelectorAll(".actions button");
let i = 0;
let combinaison;
let interval;
let myProposition = "";

/**
 * 
 * @param {String} combinaison 
 */
function showCombinaison(c) {
    combinaison = c;
    i = 0;
    interval = setInterval(animate, 1000);
}

function animate() {
    if (i < combinaison.length) {
        const letter = combinaison.charAt(i);
        buttons.forEach(button => button.style.transform = "scale(1.0)");
        for (let j = 0; j < buttons.length; j++) {
            if (buttons[j].innerHTML.includes(letter)) {
                buttons[j].style.transform = "scale(1.5)";
            }
        }
    }
    i++;
    if (i > combinaison.length) {
        buttons.forEach(button => button.style.transform = "scale(1.0)");
        clearInterval(interval);
    }
}

function getPseudo() {
    const pseudo = Math.random().toString(36).substring(7);
    document.querySelector(".pseudo").innerHTML = "Moi: " + pseudo;
    return pseudo;
}

function createGame() {
    const pseudo = getPseudo();
    const sid = socket.id;
    socket.emit("create_game", { sid, pseudo });
}

function joinGame() {
    const gameId = document.querySelector("#gameId").value;
    const pseudo = getPseudo();
    const sid = socket.id;
    socket.emit("join_game", { sid, pseudo, gameId });

}

function play(letter) {
    if(current == index){
        if(myProposition.length < combinaison.length+1){
            myProposition += letter;
            console.log(myProposition);
        }
        if(myProposition.length > combinaison.length) {
            const gameId = document.querySelector(".game").innerHTML.split("ID: ")[1];
            socket.emit("play", { index, combinaison: myProposition, gameId });
            myProposition = "";
        }
    }
}

