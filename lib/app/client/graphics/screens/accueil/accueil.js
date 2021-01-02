let partieID = null;

function showGetStart(){
    load();
    document.querySelector(".getstart").classList.add("show-getstart");
    document.querySelector("#jouer").style.display = "none";
}

function join(){
    partieID = document.querySelector("#partieid").value;
    displayPseudoModal("Vous allez rejoindre la partie " + partieID);
}

function create(){
    displayPseudoModal("Vous allez rejoindre une partie que vous aurez créée !");

}

function displayPseudoModal(message){
    document.querySelector("#pseudo-modal").classList.add("show-modal");
    document.querySelector(".modal-message").innerHTML = message;
}

function hidePseudoModal(){
    document.querySelector("#pseudo-modal").classList.remove("show-modal");
    document.querySelector(".modal-message").innerHTML = "";
    partieID = null;
}

function startGame(){

    console.log("create game and play it");
    const pseudo = document.querySelector("#pseudo_input").value;
    if(partieID){
        boombox.joinGame(pseudo, partieID);
    } else {
        boombox.createGame(pseudo);
    }
    hidePseudoModal();
}