import {Game, LeftDirection, DownDirection, RightDirection, UpDirection} from "./game.js";

let game;

const canvas = document.getElementById('field');
const context = canvas.getContext('2d');
const highScoreDiv = document.getElementById('high-score');
const speedFactorDiv = document.getElementById('speed-factor');
const newGameButton = document.getElementById('new-game');
const speedFactorInput = document.getElementById('speed-factor-input');
const boundariesInput = document.getElementById('boundaries-input');
let previousUpdate = null;

let cancel;

let speedUp = false;


const movesStack = [];

const frames = [200, 150, 130, 115, 100, 90, 80, 60, 45, 30];

// toDO: run animation every frame
function processFrame(timestamp) {
    cancel = window.requestAnimationFrame(processFrame);
    const frame = timestamp - previousUpdate;

    if (frame < frames[game.speedFactor - 1] && previousUpdate != null) {
        return;
    }
    previousUpdate = timestamp;

    if (!game.move(movesStack.shift())) {
        alert('GameOver');
        window.cancelAnimationFrame(cancel);
    }


    draw();
}

function draw() {
    context.save();
    context.scale(canvas.width / game.width, canvas.height / game.height);

    context.clearRect(0, 0, game.width, game.height);

    context.lineWidth = 1 / 20;

    for (let i = 0; i < game.snake.length; i++) {

        if (game.snake[i] === game.head) {
            context.strokeStyle = 'red';
            context.fillStyle = 'red';
        }

        context.strokeRect(game.snake[i].x + 1 / 20, game.snake[i].y + 1 / 20, 18 / 20, 18 / 20);
        context.fillRect(game.snake[i].x + 3 / 20, game.snake[i].y + 3 / 20, 14 / 20, 14 / 20)
    }

    context.strokeStyle = 'green';
    context.fillStyle = 'green';

    context.strokeRect(game.food.x + 1 / 20, game.food.y + 1 / 20, 18 / 20, 18 / 20);
    context.fillRect(game.food.x + 3 / 20, game.food.y + 3 / 20, 14 / 20, 14 / 20);

    context.restore();

    highScoreDiv.innerText = game.score;
    speedFactorDiv.innerText = game.speedFactor;
}

document.addEventListener('keydown', (event) => {
    // up
    switch (event.code) {
        case 'Space':
            speedUp = true;
            break;
        case 'KeyS':
        case 'ArrowDown':
            movesStack.push(DownDirection);
            break;
        case 'KeyW':
        case 'ArrowUp':
            movesStack.push(UpDirection);
            break;
        case 'KeyA':
        case 'ArrowLeft':
            movesStack.push(LeftDirection);
            break;
        case 'KeyD':
        case 'ArrowRight':
            movesStack.push(RightDirection);
            break;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        speedUp = false;
    }
});

newGameButton.addEventListener('click', (event) => {

    game = new Game(speedFactorInput.value, boundariesInput.checked);
    cancel = requestAnimationFrame(processFrame);
});