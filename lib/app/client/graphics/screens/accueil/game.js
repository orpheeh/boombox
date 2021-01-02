let boombox = null;

function load(){
    document.querySelector(".boombox").classList.add("show-boombox")
    boombox = new BoomBoxClient({
        onWait: (data) => {
            document.querySelector(".boombox-gameid").innerHTML = data.gameId;
            document.querySelector(".boombox-pseudo").innerHTML = boombox.pseudo;
            document.querySelector(".wait").classList.add("show");
            document.querySelector(".game-panel").classList.remove("show");
            document.querySelector("#game").style.display = "none";
        },
        onGame: (data) => {
            document.querySelector(".wait").classList.remove("show");
            document.querySelector(".game-panel").classList.add("show");
            document.querySelector("#game").style.display = "none";
            document.querySelector(".autre-pseudo").innerHTML = data.players[1 - data.index].pseudo;
            document.querySelector(".moi-pseudo").innerHTML = data.players[data.index].pseudo;
        },
        onAnimEnd: () => {
            if(boombox.current == boombox.index){
                //display modal after animation
                document.querySelector("#play-modal").classList.add("show-modal");
            }
        },
        onRestart: (data) => {
            document.querySelector(".moi").innerHTML = data.monscore;
            document.querySelector(".autre").innerHTML = data.autrescore;
        },
        onWin: (data) => {
            document.querySelector("#win").classList.add("show-modal");
            setTimeout(() => {
                document.querySelector("#win").classList.remove("show-modal");
                boombox.onAnimEnd();
            }, 5000);
        },
        onLose: (data) => {
            document.querySelector("#lose").classList.add("show-modal");
            setTimeout(() => {
                document.querySelector("#lose").classList.remove("show-modal");
                boombox.onAnimEnd();
            }, 5000);
        }
    });
    boombox.connect();
}

function play(letter){
    if(boombox.play(letter)){
        document.querySelector("#play-modal").classList.remove("show-modal");
    }
}