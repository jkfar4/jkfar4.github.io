// Controls
document.addEventListener("keydown", function (event) {
    let key = event.keyCode;
    switch (key) {
        case 37:
            //left
            if (snake.movingRight()) {
                return;
            }
            snake.dy = 0;
            snake.dx = -gameUnit;
            break;
        case 38:
            //Up
            if (snake.movingDown()) {
                return;
            }
            snake.dy = -gameUnit;
            snake.dx = 0;
            break;
        case 39:
            //Right
            if (snake.movingLeft()) {
                return;
            }
            snake.dy = 0;
            snake.dx = gameUnit;
            break;
        case 40:
            //Down
            if (snake.movingUp()) {
                return;
            }
            snake.dy = gameUnit;
            snake.dx = 0;
            break;
        default:
            break;
    }
});