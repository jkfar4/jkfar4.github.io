
let fps = 8;
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;
const canvas = document.querySelector("#myCanvas");
let gameCanvas = new SnakeCanvas(canvas);

const gameWidth = gameCanvas.width;
const gameUnit = gameCanvas.unitWidth;

const startingX = gameWidth - (gameUnit * 4);
const startingY = gameWidth / 2;
// The starting snake: it will initially move left 1 unit/frame
let snake = new Snake(startingX, startingY, gameUnit, gameUnit);
snake.grow();
snake.grow();
snake.dx = -gameUnit;
snake.dy = 0;
// starting food: randomly positioned on game with a radius that fits within a game unit.
let food = new Food(gameCanvas.getRandomUnitCoordinate(), gameCanvas.getRandomUnitCoordinate(), gameCanvas.unitWidth / 3);

gameCanvas.snake = snake;
gameCanvas.food = food;

// Game Loop
draw();


// animation loop (gameloop)
function draw() {
    window.requestAnimationFrame(draw)
    
    /* credits to : https://gist.github.com/elundmark/38d3596a883521cb24f5 
    explaining how to control the frame rate with request animation frame
    */
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);

        gameCanvas.clearCanvas();
        snake.move();
        repositionHead(snake.head);
        gameCanvas.drawFood();
        gameCanvas.drawSnake();
        if (gameCanvas.snakeOnFood()) {
            addPoints();
            snake.grow();
            gameCanvas.updateFoodLocation();
        }
       
    }
}

/**
 * When the snake is moved it may have intersected a wall
 * Therefore, we need to update the head depending on which wall the snake collided into.
 */
function repositionHead(snakeHead) {
    const leftWall = 0; //x = 0
    const topWall = 0; //y = 0
    const rightWall = canvas.width;
    const bottomWall = canvas.height;

    const leftWallIntersected = snakeHead.canvasX < leftWall;
    const topWallIntersected = snakeHead.canvasY < topWall;
    const rightWallIntersected = snakeHead.canvasX + snakeHead.width > rightWall;
    const bottomWallIntersected = snakeHead.canvasY + snakeHead.height > bottomWall;

    if (leftWallIntersected) {
        snakeHead.canvasX = rightWall + snake.dx;  // reposition x-coordinate
    } else if (topWallIntersected) {
        snakeHead.canvasY = bottomWall + snake.dy; // reposition y - coordinate
    } else if (rightWallIntersected) {
        snakeHead.canvasX = leftWall; // reposition x-coordinate
    } else if (bottomWallIntersected) {
        snakeHead.canvasY = topWall; // reposition y - coordinate
    }
}

function addPoints(){
    const maxLengthScore = 4;
    const score = document.querySelector("#score");
    let updatedScore = +score.textContent + food.points;
    score.textContent = updatedScore.toString().padStart(maxLengthScore,"0");
}

