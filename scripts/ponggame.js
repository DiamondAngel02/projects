const canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 400;
const ctx = canvas.getContext("2d");
const paddleWidth = 8;
const paddleHeight = 80;
let playerScore = 0;
let computerScore = 0;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let playerPosition = canvas.height / 2;
let computerPosition = canvas.height / 2;
let moveX;
let moveY;
let ballRadius = 10;
const winningTotal = 3;
let gameLoop;
let gameRunning = false

ctx.fillStyle = "white"
ctx.font = "30px Helvetica"
ctx.textAlign = "center"
ctx.fillText("Press Enter to play!", canvas.width / 2, canvas.height / 2)


// Will be stored above in the constant ctx (assess rendering context)
// variables
// acess to 2d drawing features, draw on canvas 

//grid and coordinates, x and y axels
//top left corner x=0 y=0, change height and width values

//moving objects with keys

function randomMovement() {
    //between 2-4
    const randomX = Math.ceil(Math.random() * 3) + 2;
    //between 0-2
    const randomY = Math.floor(Math.random() * 3);
    const plusOrMinusX = Math.random() < 0.5 ? "-" : "+";
    const plusOrMinusY = Math.random() < 0.5 ? "-" : "+";
    const randomNumber = Math.random();
    moveX = Number(plusOrMinusX + randomX) + randomNumber;
    moveY = Number(plusOrMinusX + randomX) + randomNumber;
}

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(e) { //e stands for event, we need to access the event info to find out which key is being pressed. Adding event info to the function. 
    switch (e.code) {
        case "Enter":
            gameStart();
            break;
        case "ArrowUp":
            if (playerPosition - paddleHeight / 2 <= 0) return;
            playerPosition -= 15; //subtraction assignment operator, subtract our particular values from our current value, and reupdate
            break;
        case "ArrowDown":
            if (playerPosition + paddleHeight / 2 >= canvas.height) return;    
            playerPosition += 15;
            break;
    }
}


function gameStart() {
    if (gameRunning) return;
    gameRunning = true;
    randomMovement();
    ballX = canvas.width / 2;
    playerScore = 0;
    computerScore = 0;
    clearInterval(gameLoop);
    gameLoop = setInterval(loop, 15);
}


function drawPlayerPaddle() {
    ctx.fillStyle = "blue"; //ctx.strokeStyle (change color)
    ctx.fillRect(0, playerPosition - paddleHeight / 2, paddleWidth, paddleHeight);
}


//ctx.strokeReact (give an outline instead)
function drawComputerPaddle() {
    ctx.fillStyle = "red";
    ctx.fillRect(
        canvas.width - paddleWidth,
        computerPosition - paddleHeight / 2,
        paddleWidth,
        paddleHeight
    );
}


function drawBall() {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
    ballX += moveX;
    ballY += moveY;
}
//canvas.width / 2, canvas.height / 2 (static position, center)

//make a arc or a curve, form a circle by rotating 
//all the way round to the starting position, located by the center

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = ("30px Helvetica");
    ctx.fillText(playerScore, canvas.width / 4, 50);
    ctx.fillText(computerScore, canvas.width * 0.75, 50);
}


//beginPath - To differentiate and seperate the sections from one another.

function drawCanvas() {
    ctx.beginPath();
    ctx.setLineDash([6]);
    ctx.moveTo(canvas.width / 2, 0); //move to the starting position 
    ctx.lineTo(canvas.width / 2, canvas.height); //draw a line on the canvas from start to the end position which we set
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, 2 * Math.PI);
    ctx.stroke();
}

function collide() {
    // bounce off top and bottom
    if (ballY > canvas.height - ballRadius || ballY - ballRadius <= 0) {
        moveY = -moveY;
    }

    // check for score x axis (both sides)
    if (ballX <= ballRadius) {
        score("computer");
    } else if (ballX + ballRadius >= canvas.width) {
        score("player")
    }

    // check player paddle contact
    if (
        ballX <= ballRadius + paddleWidth &&
        Math.abs(ballY - playerPosition) <= paddleHeight / 2 + ballRadius
    ) {
        moveX = -moveX + generateRandomBounce();
    }

    // check computer paddle contact 
    if (
        ballX + ballRadius >= canvas.width - paddleWidth &&
        Math.abs(ballY - computerPosition) <= paddleHeight / 2 + ballRadius
    ) {
        moveX = -moveX + generateRandomBounce();
    }
}

function score(player) {
    if (player === "computer"){
        computerScore++;
    } else {
        playerScore++;
    }
    if (computerScore === winningTotal) {
        endGame('computer');
        return;
    }
    else if (playerScore === winningTotal){
        endGame('player');
        return;
    }
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function endGame(winner) {
    gameRunning = false;
    clearInterval(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    if (winner === 'computer') {
        ctx.fillStyle = 'red';
    }
    else {
        ctx.fillStyle = 'blue'; 
    }
    ctx.textAlign = 'center'
    ctx.fillText(`The winner is: ${winner}`, canvas.width / 2, canvas.height / 2);
}

function moveComputer(){
    if (computerPosition < ballY) {
        computerPosition++;
    } else {
        computerPosition--;
    }
}

function generateRandomBounce(){
    const number0to1 = Math.floor(Math.random() * 2);
    const positiveOrNegative = number0to1 === 0 ? "-" : "+";
    return Number(positiveOrNegative + Math.random() / 2);
}

//loop setInterval will restart after a number of ms.
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPlayerPaddle();
    drawComputerPaddle();
    drawScore();
    drawCanvas();
    //drawBallCollide(); void
    collide();
    moveComputer();
    generateRandomBounce();
};

