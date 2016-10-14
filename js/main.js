'use strict';

var canvas = $('#myCanvas')[0];
var ctx = canvas.getContext('2d');

// Listen for events
$(document).keydown(keyDownHandler);
$(document).keyup(keyUpHandler);
$('#myCanvas').on('mousemove', mouseMoveHandler);

// Constants
var RIGHT_CURSOR_CODE = 39;
var LEFT_CURSOR_CODE = 37;

// Properties
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var lives = 3;
var paddleHeight = 10;
var paddleWidth = 75;
var score = 0;
var gameWon = false;

// Coordinates
var ball = Ball(10, canvas.width / 2, canvas.height - 30);
var dx = 2;
var dy = -2;
var paddleX = (canvas.width - paddleWidth) / 2;

// Controls
var rightPressed = false;
var leftPressed = false;

// Create bricks
var bricks = [];
for (var i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for (var j = 0; j < brickRowCount; j++) {
        bricks[i][j] = {
            x : 0,
            y : 0,
            isDestroyed: false
        };
    }
}

function keyDownHandler(e) {
    if (e.keyCode === RIGHT_CURSOR_CODE) {
        rightPressed = true;
        return;
    }

    if (e.keyCode === LEFT_CURSOR_CODE) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode === RIGHT_CURSOR_CODE) {
        rightPressed = false;
        return;
    }

    if (e.keyCode === LEFT_CURSOR_CODE) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (var i = 0; i < brickColumnCount; i++) {
        for (var j = 0; j < brickRowCount; j++) {
            var brick = bricks[i][j];
            if (brick.isDestroyed) {
                continue;
            }

            if (ball.x > brick.x &&
                ball.x < brick.x + brickWidth &&
                ball.y > brick.y &&
                ball.y < brick.y + brickHeight
            ) {
                brick.isDestroyed = true;
                score++;
                dy = -dy;
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var i = 0; i < brickColumnCount; i++) {
        for (var j = 0; j < brickRowCount; j++) {
            var currentBrick = bricks[i][j];
            if (currentBrick.isDestroyed) {
                continue;
            }

            var brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
            currentBrick.x = brickX;
            currentBrick.y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
        }
    }
}

function drawGameOver() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over!', canvas.width / 2 - 65, canvas.height / 2);
}

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawYouWin() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'green';
    ctx.fillText('You Win!', canvas.width / 2 - 65, canvas.height / 2);
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#00095DD';
    ctx.fillText('Score: ' + score, 8, 20);

    if (score === brickColumnCount * brickRowCount) {
        // clearInterval(drawInterval);
        drawYouWin();
        gameWon = true;
    }
}

function animateLostLife() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();

    requestAnimationFrame(animateLostLife);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBricks();
    drawPaddle();
    drawScore();
    drawLives();

    collisionDetection();

    if (gameWon) {
        return;
    }

    if (ball.y + dy < ball.radius) {
        dy = -dy;
    } else if (ball.y + dy > canvas.height - ball.radius) {
        if (ball.x > paddleX && ball.x < paddleX + paddleWidth + 4) {
            dy = -dy;
        } else {
            lives--;
            if (lives < 0) {
                // clearInterval(drawInterval);
                drawGameOver();
                var audio = new Audio('./sound/game-over.mp3');
                audio.play();
                return;
            }

            animateLostLife();

            ball.x = canvas.width / 2;
            ball.y = canvas.height - 30;
            dx = -2;
            dy = -2;
            paddleX = (canvas.width - paddleWidth) / 2;
        }
    }

    if (ball.x + dx < ball.radius || ball.x + dx > canvas.width - ball.radius) {
        dx = - dx;
    }

    if (rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    ball.x += dx;
    ball.y += dy;

    requestAnimationFrame(draw);
}

draw();
