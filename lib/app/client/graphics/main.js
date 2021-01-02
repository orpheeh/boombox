const config = {
    type: Phaser.AUTO,
    width: 512,
    height: 1024,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload (){
    this.load.image('fond', '/public/graphics/assets/fond.jpg');
}

function create (){
    var i = this.add.image(256, 512, 'fond');

    // Stretch to fill
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    game.scale.startFullScreen(trop);
}

function update (){
}