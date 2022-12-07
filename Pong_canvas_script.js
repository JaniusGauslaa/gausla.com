const gameContainer = document.getElementById("gameContainer");
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const FullScreenBtn = document.querySelector("#FullScreenBtn");
const gameModeEasy = document.querySelector("#gameModeEasy");
const gameModeMedium = document.querySelector("#gameModeMedium");
const gameModeHard = document.querySelector("#gameModeHard");
const gameModeImpossible = document.querySelector("#gameModeImpossible");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
var boardBackground = get("back-color");
var paddle1Color = get("color");
var paddle2Color = get("color");
const paddleBorder = "black";
var ballColor = get("ball-color");
const ballBorderColor = "black";
const ballRadius = 12.5;
let intervalID;
let ballSpeed;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0
};
let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100
};
var error, I, D, PIDout, timeDelta;
var prevError = 0;
I = 0;
D = 0;
let KP;
let KI;
let KD;

resetBtn.addEventListener("click", resetGame);
FullScreenBtn.addEventListener("click", fullScreen);
gameModeEasy.addEventListener("click", easy);
gameModeMedium.addEventListener("click", medium);
gameModeHard.addEventListener("click", hard);
gameModeImpossible.addEventListener("click", impossible);
gameBoard.addEventListener("dblclick", exitFullscreen)

var collection = gameContainer.children;
collection[1].onmousemove = function (event) {
    paddle1.y = event.offsetY - paddle1.height/2;
};

function onload() {
    clearBoard();
    drawPaddles();
};

function fullScreen() {
    //if (getFullscreenElement() == null) {
    gameBoard.requestFullscreen();
    //} else {
        //document.exitFullscreen();
    //}
};

function exitFullscreen() {
    document.exitFullscreen();
}

//function getFullscreenElement() {
    //return document.fullscreenElement;
//};

function easy() {
    set("sca", 0);
    set("opa", 0);
    set("p-event", "none");
    KP = 0.07;
    KI = 0.0001;
    KD = 0;
    gameStart();
};

function medium() {
    set("sca", 0);
    set("opa", 0);
    set("p-event", "none");
    KP = 0.14;
    KI = 0.0001;
    KD = 0;
    gameStart();
}

function hard() {
    set("sca", 0);
    set("opa", 0);
    set("p-event", "none");
    KP = 0.2;
    KI = 0.0001;
    KD = 0;
    gameStart();
}

function impossible() {
    set("sca", 0);
    set("opa", 0);
    set("p-event", "none");
    KP = 0.45;
    KI = 0.0001;
    KD = 0;
    gameStart();
}

function get(css_var) {
    return (getComputedStyle(document.documentElement).getPropertyValue('--'+css_var));
}

function set(css_var, css_var_value) {
    document.documentElement.style.setProperty('--'+css_var, css_var_value);
}

function changeColor() {
    var new_hue = (get("hue"))-0.5
    set("hue", new_hue)
}

function gameStart(){
    createBall();
    nextTick();
};
function nextTick(){
    intervalID = setTimeout(() => {
        clearBoard();
        drawPaddles();
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        nextTick();
        paddle2.y += PID(ballY, paddle2.y + paddle2.height/2, KP, KI, KD);
    }, 10)
};
function clearBoard(){
    boardBackground = get("back-color")
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function drawPaddles(){
    ctx.strokeStyle = paddleBorder;

    paddle1Color = get("color");
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    paddle2Color = get("color");
    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
};
function createBall(){
    ballSpeed = 3;
    if(Math.round(Math.random()) == 1){
        ballXDirection =  1; 
    }
    else{
        ballXDirection = -1; 
    }
    if(Math.round(Math.random()) == 1){
        ballYDirection = getRandomNumber(0.5, 1) * 1;
    }
    else{
        ballYDirection = getRandomNumber(0.5, 1) * -1;
    }
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    drawBall(ballX, ballY);
};
function moveBall(){
    ballX += (ballSpeed * ballXDirection);
    ballY += (ballSpeed * ballYDirection);
};
function drawBall(ballX, ballY){
    changeColor();
    ballColor = get("ball-color")
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
};
function checkCollision(){
    if(ballY <= 0 + ballRadius){
        play("wall_sound.mp3")
        ballYDirection *= -1;
    }
    if(ballY >= gameHeight - ballRadius){
        play("wall_sound.mp3")
        ballYDirection *= -1;
    }
    if(ballX <= 0){
        play("score_sound.mp3");
        player2Score+=1;
        updateScore();
        createBall();
        return;
    }
    if(ballX >= gameWidth){
        play("score_sound.mp3")
        player1Score+=1;
        updateScore();
        createBall();
        return;
    }
    if(ballX <= (paddle1.x + paddle1.width + ballRadius)){
        if(ballY > paddle1.y && ballY < paddle1.y + paddle1.height){
            ballX = (paddle1.x + paddle1.width) + ballRadius; // Hvis ballen setter seg fast
            play("paddle_sound.mp3");
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
    if(ballX >= (paddle2.x - ballRadius)){
        if(ballY > paddle2.y && ballY < paddle2.y + paddle2.height){
            ballX = paddle2.x - ballRadius; // Hvis ballen setter seg fast
            play("paddle_sound.mp3");
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
};

function updateScore(){
    scoreText.textContent = `${player1Score} : ${player2Score}`;
};
function resetGame(){
    player1Score = 0;
    player2Score = 0;
    paddle1 = {
        width: 25,
        height: 100,
        x: 0,
        y: 0
    };
    paddle2 = {
        width: 25,
        height: 100,
        x: gameWidth - 25,
        y: gameHeight - 100
    };
    ballSpeed = 1;
    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearInterval(intervalID);
    clearBoard();
    drawPaddles();
    set("sca", 1);
    set("opa", 0.5);
    set("p-event", "all")
};

function play(sound) {
    var audio = new Audio(sound);
    audio.play();
};

function PID(SP, PV, KP, KI, KD) {
    var timeDelta = 10;
    error = SP - PV;
    I += error * timeDelta;
    D = (error-prevError)/timeDelta
    prevError = error;
    PIDout = KP * error + KI * I + KD * D;
    return PIDout;
};

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
};