class SnakeCanvas {

    constructor(canvas) {
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d"); // A reference to the rendering context - we can use this to paint on the canvas
        this._snake = null;
        this._food = null;
        this._width = canvas.width;
        this._height = canvas.height;
        this._unitsX = 20; //Divide the game grid up equally into 20px x 20px blocks
        this._unitsY = this._unitsX;
        this._unitWidth = this._width / this._unitsX;
    }

    clearCanvas() {
        //the whole area covered by the rect will be cleared of any content previously panted there.
        this._ctx.clearRect(0, 0, this._width, this._height);
    }

    drawSnake() {
        this._ctx.fillStyle = this._snake.colour;
        this._snake.body.forEach(segment => this._ctx.fillRect(segment.canvasX, segment.canvasY, segment.width, segment.height));
    }

    drawFood() {
        this._ctx.fillStyle = this._food.colour;
        this._ctx.strokeStyle = this._food.outlineColour;
        this._ctx.beginPath();
        this._ctx.arc(this._food.x, this._food.y, this._food.radius, 0, 2 * Math.PI);
        this._ctx.fill();
        this._ctx.stroke();
        this._ctx.closePath();
    }

    // Can be used to get a random x,y coordinate for food. 
    getRandomUnitCoordinate() {
        // Returns a random integer in the range of min and max inclusive
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return ((this._unitWidth * getRandomInt(0, this._unitsX - 1)) + (this._unitWidth / 2));
    }
    // TODO - don't reposition food in a location already occupied by the snake.
    updateFoodLocation() {
        this._food.x = this.getRandomUnitCoordinate();
        this._food.y = this.getRandomUnitCoordinate();
    }

    // Checks if the snake's head is on top of the food
    snakeOnFood() {
        let snakeHead = this._snake.body[0];
        return ((snakeHead.canvasX <= this._food.x) && (snakeHead.canvasX + this._unitWidth) >= this._food.x) && ((snakeHead.canvasY <= this._food.y) && (snakeHead.canvasY + this._unitWidth) >= this._food.y);

    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get unitsX() {
        return this._unitsX;
    }

    get unitWidth() {
        return this._unitWidth;
    }

    set snake(snake) {
        if (snake instanceof Snake) {
            this._snake = snake;
        }
    }

    set food(food) {
        if (food instanceof Food) {
            this._food = food;
        }
    }
}