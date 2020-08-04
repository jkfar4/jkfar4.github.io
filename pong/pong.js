"use strict";
function pong() {
    const pongCanvas = document.getElementById("canvas"), player = new Elem(pongCanvas, "rect")
        .attr('x', 550).attr('y', 300)
        .attr('width', 15).attr('height', 70)
        .attr('fill', '#ffffff'), ball = new Elem(pongCanvas, "ellipse")
        .attr('cx', 300).attr('cy', 300)
        .attr('rx', 10).attr('ry', 10)
        .attr('fill', '#ffffff'), computer = new Elem(pongCanvas, "rect")
        .attr('x', 50).attr('y', 300)
        .attr('width', 15).attr('height', 70)
        .attr('fill', '#ffffff');
    playerMovementObservable(player);
    computerMovementObservable(computer, ball);
    ballMovementAndReflectionObservable(ball, player, computer);
    scoringObservable(ball);
}
function playerMovementObservable(player) {
    const pongCanvas = document.getElementById("canvas"), mousemove = Observable.fromEvent(pongCanvas, "mousemove"), pongCanvasBounds = pongCanvas.getBoundingClientRect();
    mousemove
        .map(({ clientY }) => ({ y: clientY - pongCanvasBounds.top }))
        .subscribe(({ y }) => player.attr('y', y));
    mousemove
        .map(({ clientY }) => ({ y: clientY - pongCanvasBounds.top, yLimit: pongCanvas.clientHeight - Number(player.attr("height")) }))
        .filter(({ y, yLimit }) => y > yLimit)
        .subscribe(({ yLimit }) => player.attr("y", yLimit));
}
function ballMovementAndReflectionObservable(ball, player, computer) {
    const pongCanvas = document.getElementById("canvas"), playerScore = document.getElementById("playerScore"), computerScore = document.getElementById("computerScore"), moveAndReflectInterval = 5;
    var incrementX = 1;
    var incrementY = 1;
    Observable.interval(moveAndReflectInterval)
        .filter(() => !isGameOver(playerScore, computerScore))
        .subscribe(() => ball
        .attr('cx', incrementX + Number(ball.attr('cx')))
        .attr('cy', incrementY + Number(ball.attr('cy'))));
    getBallObservableWithInterval(moveAndReflectInterval, ball)
        .map(({ ballX, radiusX, ballY }) => ({ rightSideBall: ballX + radiusX, y: ballY }))
        .filter(({ rightSideBall, y }) => ((rightSideBall == Number(player.attr("x"))) && ((y >= Number(player.attr("y"))) && (y <= Number(player.attr("y")) + Number(player.attr("height"))))))
        .subscribe(_ => {
        incrementX *= -1;
    });
    getBallObservableWithInterval(moveAndReflectInterval, ball)
        .map(({ ballX, radiusY, ballY }) => ({ leftSideBall: ballX - radiusY,
        computerPaddleFace: Number(computer.attr('x')) + Number(computer.attr('width')),
        ballY,
        topComputerPaddle: Number(computer.attr('y')),
        botComputerPaddle: Number(computer.attr('y')) + Number(computer.attr('height')) }))
        .filter(({ leftSideBall, computerPaddleFace, ballY, topComputerPaddle, botComputerPaddle }) => ((leftSideBall == computerPaddleFace) && ((ballY >= topComputerPaddle) && (ballY <= botComputerPaddle))))
        .subscribe(_ => {
        incrementX *= -1;
    });
    getBallObservableWithInterval(moveAndReflectInterval, ball)
        .map(({ ballY, radiusY }) => ({ topSideBall: ballY - radiusY }))
        .filter(({ topSideBall }) => topSideBall === pongCanvas.clientTop)
        .subscribe(() => {
        incrementY *= -1;
    });
    getBallObservableWithInterval(moveAndReflectInterval, ball)
        .map(({ ballY, radiusY }) => ({ botSideball: ballY + radiusY }))
        .filter(({ botSideball }) => botSideball === pongCanvas.clientHeight)
        .subscribe(() => {
        incrementY *= -1;
    });
}
function computerMovementObservable(computer, ball) {
    const pongCanvas = document.getElementById("canvas"), computerMoveInterval = 5;
    getBallObservableWithInterval(computerMoveInterval, ball)
        .map(({ ballY }) => ({ align: ballY - (Number(computer.attr("height")) / 2) }))
        .subscribe(({ align }) => computer.attr('y', align));
    getBallObservableWithInterval(computerMoveInterval, ball)
        .map(_ => ({ yComputer: Number(computer.attr('y')), yLimit: Number(pongCanvas.getAttribute("height")) - Number(computer.attr("height")) }))
        .filter(({ yComputer, yLimit }) => yComputer >= yLimit)
        .subscribe(({ yLimit }) => computer.attr("y", yLimit));
    getBallObservableWithInterval(computerMoveInterval, ball)
        .map(_ => ({ yComputer: Number(computer.attr('y')), yLimit: pongCanvas.clientTop }))
        .filter(({ yComputer, yLimit }) => yComputer <= yLimit)
        .subscribe(({ yLimit }) => computer.attr("y", yLimit));
}
function scoringObservable(ball) {
    const pongCanvas = document.getElementById("canvas"), playerScore = document.getElementById("playerScore"), computerScore = document.getElementById("computerScore"), scoringInterval = 400;
    getBallObservableWithInterval(scoringInterval, ball)
        .map(({ ballX, radiusX }) => ({ leftSideBall: ballX - radiusX }))
        .filter(({ leftSideBall }) => ((leftSideBall > pongCanvas.clientWidth)))
        .subscribe(_ => { incrementScore(computerScore); });
    getBallObservableWithInterval(scoringInterval, ball)
        .map(({ ballX, radiusX }) => ({ rightSideBall: ballX + radiusX }))
        .filter(({ rightSideBall }) => rightSideBall < pongCanvas.clientLeft)
        .subscribe(_ => { incrementScore(playerScore); });
    getBallObservableWithInterval(scoringInterval, ball)
        .map(({ ballX, radiusX }) => ({ leftSideBall: ballX - radiusX, rightSideBall: ballX + radiusX }))
        .filter(({ leftSideBall, rightSideBall }) => ((leftSideBall >= pongCanvas.clientWidth) || (rightSideBall <= pongCanvas.clientLeft)))
        .subscribe(() => {
        ball.attr("cx", 300).attr("cy", getRandomStartingPosition(ball, pongCanvas));
    });
    Observable.interval(scoringInterval).subscribe(_ => {
        if (playerScore && (Number(playerScore.innerHTML) == 11)) {
            const playerText = document.getElementById("alertPlayerText");
            const playerWinnerText = document.getElementById("alertPlayerWinnerText");
            if (playerText && playerWinnerText) {
                playerText.innerHTML = "Player";
                playerWinnerText.innerHTML = "WINS";
            }
        }
        if (computerScore && (Number(computerScore.innerHTML) == 11)) {
            const computerText = document.getElementById("alertComputerText"), computerWinnerText = document.getElementById("alertComputerWinnerText");
            if (computerText && computerWinnerText) {
                computerText.innerHTML = "Computer";
                computerWinnerText.innerHTML = "WINS";
            }
        }
    });
}
function getRandomStartingPosition(ball, pongCanvas) {
    const min = Number(ball.attr('ry'));
    const max = Number(pongCanvas.getAttribute("height")) - Number(ball.attr('ry'));
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getBallObservableWithInterval(ms, ball) {
    return Observable.interval(ms).map(() => ({ ballX: Number(ball.attr("cx")), ballY: Number(ball.attr("cy")),
        radiusX: Number(ball.attr("rx")), radiusY: Number(ball.attr("ry")) }));
}
function incrementScore(enity) {
    if (enity) {
        var newScore = Number(enity.innerHTML);
        newScore++;
        enity.innerHTML = String(newScore);
    }
}
function isGameOver(playerScore, computerScore) {
    if (playerScore && computerScore) {
        if ((Number(playerScore.innerHTML) < 11) && (Number(computerScore.innerHTML) < 11)) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
}
if (typeof window != 'undefined')
    window.onload = () => {
        pong();
    };
//# sourceMappingURL=pong.js.map