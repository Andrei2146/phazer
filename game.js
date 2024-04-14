
var gameWidth = 1600;
var gameHeight = 600;


var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'gameDiv');


var character;
var ground;
var coins;
var enemy;
var score = 0; 


var characterWidth = 64;
var characterHeight = 64;
var groundWidth = 2000;
var groundHeight = 32;
var enemyWidth = 64;
var enemyHeight = 64;


var coinSound;


var gameState = {
    preload: function() {
       
        game.load.image('character', 'assets/character.png');
        game.load.image('ground', 'assets/ground.png');
        game.load.image('coin', 'assets/coin.png');
        game.load.image('enemy', 'assets/enemy.png'); 
        game.load.image('finish', 'assets/finish.png'); 

        
        game.load.audio('ding', 'assets/ding.mp3');
    },

    create: function() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);

       
        ground = game.add.sprite(100, gameHeight - 50, 'ground');
        ground.scale.setTo(groundWidth / ground.width, groundHeight / ground.height); 
        game.physics.arcade.enable(ground);
        ground.body.immovable = true; 

        
        character = game.add.sprite(300, gameHeight - 100, 'character'); 
        character.anchor.setTo(0.5);
        game.physics.arcade.enable(character);
        character.body.gravity.y = 500; 

       
        enemy = game.add.sprite(100, gameHeight - 82, 'enemy'); 
        game.physics.arcade.enable(enemy);
        enemy.body.velocity.x = 100; 
        enemy.body.collideWorldBounds = true; 


        coins = game.add.group();
        coins.enableBody = true;

       
        for (var i = 0; i < 8; i++) {
            var coin = coins.create(100 + i * 200, gameHeight - 50, 'coin');
            coin.anchor.setTo(0.5);
            coin.scale.setTo(0.5);
        }

        
        var finish = game.add.sprite(coins.children[coins.children.length - 1].x - 5, gameHeight - 50, 'finish');
        finish.anchor.setTo(0.5);

        
        cursors = game.input.keyboard.createCursorKeys();

       
        gameOverText = game.add.text(gameWidth / 2, gameHeight / 2, 'Game Over', {
            font: '32px Arial',
            fill: '#ffffff'
        });
        gameOverText.anchor.setTo(0.5);
        gameOverText.visible = false;

       
        restartButton = game.add.text(gameWidth / 2, gameHeight / 2 + 50, 'Restart', {
            font: '24px Arial',
            fill: '#ffffff'
        });
        restartButton.anchor.setTo(0.5);
        restartButton.inputEnabled = true;
        restartButton.events.onInputDown.add(restartGame, this);
        restartButton.visible = false;

        
        scoreText = game.add.text(16, 16, 'Score: 0', {
            font: '24px Arial',
            fill: '#ffffff'
        });

       
        coinSound = game.add.audio('ding');
    },

    update: function() {
       
        if (cursors.left.isDown) {
            
            character.body.velocity.x = -150; 
        } else if (cursors.right.isDown) {
            
            character.body.velocity.x = 150;
        } else {

            character.body.velocity.x = 0;
        }

        
        game.physics.arcade.collide(character, ground);

        
        game.physics.arcade.overlap(character, enemy, gameOver, null, this);

        
        game.physics.arcade.overlap(character, coins, collectCoin, null, this);

       
        if (enemy.body.x <= 0 || enemy.body.x >= gameWidth - enemyWidth) {
            enemy.body.velocity.x *= -1;
        }
    }
};


game.state.add('game', gameState);


game.state.start('game');


function collectCoin(character, coin) {
    coin.kill(); 
    score += 10; 
    scoreText.text = 'Score: ' + score; 
    coinSound.play();
}


function gameOver() {
    gameOverText.visible = true;
    restartButton.visible = true;
    game.paused = true;
}


function restartGame() {
    gameOverText.visible = false;
    restartButton.visible = false;
    game.paused = false;
    game.state.start('game');
}
