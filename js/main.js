'use strict';

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// Listen for keyboard events
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Constants
var RIGHT_CURSOR_CODE = 39;
var LEFT_CURSOR_CODE = 37;

// Properties
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;

// Coordinates
var ballX = canvas.width / 2;
var ballY = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleX = (canvas.width - paddleWidth) / 2;

// Controls
var rightPressed = false;
var leftPressed = false;

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

function updateTable() {
    document.getElementById('x-row').innerHTML = ballX;
    document.getElementById('y-row').innerHTML = ballY;
    document.getElementById('dx-row').innerHTML = dx;
    document.getElementById('dy-row').innerHTML = dy;
    document.getElementById('paddle-x-row').innerHTML = paddleX;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    if (ballY + dy < ballRadius || ballY + dy > canvas.height - ballRadius) {
        dy = -dy;
    }

    if (ballX + dx < ballRadius || ballX + dx > canvas.width - ballRadius) {
        dx = - dx;
    }

    if (rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    // console.log(paddleX);

    ballX += dx;
    ballY += dy;

    updateTable();
}

// Execute the draw method every 10 milliseconds
setInterval(draw, 10);
