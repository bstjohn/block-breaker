'use strict';

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// Coordinates
var ballX = canvas.width / 2;
var ballY = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleZ = (canvas.width - paddleWidth) / 2;

// Properties
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;

function updateTable() {
    document.getElementById('x-row').innerHTML = ballX;
    document.getElementById('y-row').innerHTML = ballY;
    document.getElementById('dx-row').innerHTML = dx;
    document.getElementById('dy-row').innerHTML = dy;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    updateTable();
    ballX += dx;
    ballY += dy;

    if (ballY + dy < ballRadius || ballY + dy > canvas.height - ballRadius) {
        dy = -dy;
    }

    if (ballX + dx < ballRadius || ballX + dx > canvas.width - ballRadius) {
        dx = - dx;
    }
}

// Execute the draw method every 10 milliseconds
setInterval(draw, 10);
