const CANVAS_COLOR = "#ffe8f4";
const SNAKE_COLOR = "#DDA0DD";
const SNAKE_BORDER =" #800080";
const RIGHT = 39;
const LEFT = 37;
const UP = 38;
const DOWN = 40;
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const appleImage = new Image();
const beepAudio = new Audio('high-beep.mp3');
const lostSound = new Audio('lost.mp3');
let score = 0;
let dx = 10;
let dy = 0;
let gameSpeed = 100;
let lastSpeedMilestone =0;
let isGoingUp = false;
let isGoingRight = true;
let isChangingDirection = false;
let food = {
    x: null, y: null
}
let snake = [
    {x:150, y: 150}, 
    {x:140, y: 150}, 
    {x:130, y: 150}, 
    {x:120, y: 150}, 
    {x:110, y: 150}, 
]
appleImage.src = "apple.png"

function clearCanvas(){
    context.fillStyle = CANVAS_COLOR;
    context.fillRect(0,0,gameCanvas.width,gameCanvas.height);
    context.strokeRect(0,0,gameCanvas.width,gameCanvas.height);
}

function drawSnakePart(snakePart){
    const gradient = context.createLinearGradient(
        snakePart.x, snakePart.y, 
        snakePart.x + 10, snakePart.y + 10
    );
    gradient.addColorStop(0, "#34eb83");
    gradient.addColorStop(1, "#0d6d31");

    context.fillStyle = gradient;
    context.strokeStyle = "#0a4724"; 
    context.beginPath();
    context.arc(snakePart.x + 5, snakePart.y + 5, 5, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    if(snakePart === snake[0]){
        context.fillStyle = "#000";
        context.beginPath();
        context.arc(snake[0].x + 3, snake[0].y + 3, 1.5, 0, 2 * Math.PI);
        context.arc(snake[0].x + 7, snake[0].y + 3, 1.5, 0, 2 * Math.PI);
        context.fill();
    }
}
function drawSnake(){
    snake.forEach(drawSnakePart);
}

function changeDirection(event){
    if(isChangingDirection) return;
    isChangingDirection = true;
    if(event.keyCode === RIGHT && dx ===0 ) {dx = 10; dy = 0;};
    if(event.keyCode === LEFT && dx ===0 ) {dx = -10; dy = 0};
    if(event.keyCode === UP && dy ===0) {dx = 0; dy = -10};
    if(event.keyCode === DOWN && dy ===0) {dx = 0; dy = 10};
}
function advanceSnake(){
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if(isFoodEaten(head)) {
        score += 10;
        document.getElementById('score').innerText = score;
        beepAudio.play();
        generateFood();}
    else snake.pop();
}
function randomNumber(min, max){
    return Math.round((Math.random()*(max-min) + min)/10)* 10;
}

function generateFood(){
    food.x = randomNumber(0, gameCanvas.width - 10);
    food.y = randomNumber(0, gameCanvas.height - 10);
}

function isFoodEaten(position){
   return  position.x === food.x && position.y === food.y
}

function isEndGame(){
    if(isSnakeLoop() || didHitWall()){
        lostSound.play();
        return true;
    }
    return false;
    
}
function isSnakeLoop(){
    for(let i = 4; i < snake.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
}

function didHitWall(){
    return snake[0].x < 0 || snake[0].x > gameCanvas.width - 10 ||
           snake[0].y < 0 || snake[0].y > gameCanvas.height - 10;
}

function drawFood(){
    if(food.x != null && food.y != null)
    context.drawImage(appleImage, food.x, food.y, 10, 10);
}
function main() {
    if(isEndGame()) return;
    isChangingDirection = false;
    setTimeout(function onTick(){
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    main();
    },gameSpeed);
    if (score >= lastSpeedMilestone + 50 && gameSpeed > 50) {
        gameSpeed -= 5;
        lastSpeedMilestone +=50;
        console.log(gameSpeed);
    }
}

generateFood();
main();
document.addEventListener("keydown", changeDirection);
