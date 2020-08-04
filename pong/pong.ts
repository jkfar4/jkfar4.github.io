
function pong() {
  // Inside this function you will use the classes and functions 
  // defined in svgelement.ts and observable.ts
  // to add visuals to the svg element in pong.html, animate them, and make them interactive.


  // You will be marked on your functional programming style
  // as well as the functionality that you implement.
  // Document your code!  
  // Explain which ideas you have used ideas from the lectures to 
  // create reusable, generic functions.
  const
    pongCanvas = document.getElementById("canvas")!,
    player = new Elem(pongCanvas, "rect")
      .attr('x', 550).attr('y', 300)
      .attr('width', 15).attr('height', 70)
      .attr('fill', '#ffffff'),
    ball = new Elem(pongCanvas, "ellipse")
      .attr('cx', 300).attr('cy', 300)
      .attr('rx', 10).attr('ry', 10)
      .attr('fill', '#ffffff'),
    computer = new Elem(pongCanvas, "rect")
      .attr('x', 50).attr('y', 300)
      .attr('width', 15).attr('height', 70)
      .attr('fill', '#ffffff');

  playerMovementObservable(player);
  computerMovementObservable(computer, ball);
  ballMovementAndReflectionObservable(ball, player, computer);
  scoringObservable(ball);
}

/**   
   * This function controls the movement of the player paddle using observables. 
   * 
   * It does this by creating an observable, and using the observed mouse coordinates over the Pong canvas
   * to control the player paddle. 
   * @param player The player paddle element 
   */
function playerMovementObservable(player: Elem) {
  const
    pongCanvas = document.getElementById("canvas")!,
    mousemove = Observable.fromEvent<MouseEvent>(pongCanvas, "mousemove"),
    pongCanvasBounds = pongCanvas.getBoundingClientRect();


  /**
   * This controls the movement of the player paddle.
   */
  mousemove
    .map(({ clientY }) => ({ y: clientY - pongCanvasBounds.top }))
    .subscribe(({ y }) => player.attr('y', y));

  /**
   * This stops the player paddle from going outside the bottom of the pong canvas (beyond the canvas's height). 
   */
  mousemove
    .map(({ clientY }) => ({ y: clientY - pongCanvasBounds.top, yLimit: pongCanvas.clientHeight - Number(player.attr("height")) }))
    .filter(({ y, yLimit }) => y > yLimit)
    .subscribe(({ yLimit }) => player.attr("y", yLimit));

}



/**
 * This function is responsible for the movement and speed of the ball
 * @param ball 
 * @param player 
 */
function ballMovementAndReflectionObservable(ball: Elem, player: Elem, computer: Elem) {
  const
    pongCanvas = document.getElementById("canvas")!,
    playerScore = document.getElementById("playerScore"),
    computerScore = document.getElementById("computerScore"),
    moveAndReflectInterval = 5; //the interval delay used by the observables in ballMovementAndReflectionObservable.


  /**
   * This code is responsible for moving the ball;
   * 
   * @var incrementX How much the ball moves in x-direction
   * @var incrementY How much the ball moves in y-direction
   * @const ballspeed The interval (milliseconds) the ball is incremented
   * 
   * To increase the ball's speed  in game; Reduce ballspeed value or Increase both incrementX and incrementY
   * To decrease...; Increase ballspeed const or decrese both incrementX and incrementY
   */
  var incrementX = 1;
  var incrementY = 1;
  Observable.interval(moveAndReflectInterval)
    .filter(() => !isGameOver(playerScore, computerScore))
    .subscribe(() => ball
      .attr('cx', incrementX + Number(ball.attr('cx')))
      .attr('cy', incrementY + Number(ball.attr('cy'))));

  /**
   * This contols reflection of the ball when it hits the player paddle
   */
  getBallObservableWithInterval(moveAndReflectInterval, ball)//This Interval must match ball movement's otherwise it will not reflect
    .map(({ ballX, radiusX, ballY }) => ({ rightSideBall: ballX + radiusX, y: ballY }))
    .filter(({ rightSideBall, y }) => ((rightSideBall == Number(player.attr("x"))) && ((y >= Number(player.attr("y"))) && (y <= Number(player.attr("y")) + Number(player.attr("height"))))))
    .subscribe(_ => {
      incrementX *= -1;//change direction
    });

  /**
   * This controls reflection of the ball when it hits the computer paddle
   */
  getBallObservableWithInterval(moveAndReflectInterval, ball)
    .map(({ ballX, radiusY, ballY }) =>
      ({
        leftSideBall: ballX - radiusY,
        computerPaddleFace: Number(computer.attr('x')) + Number(computer.attr('width')),
        ballY,
        topComputerPaddle: Number(computer.attr('y')),
        botComputerPaddle: Number(computer.attr('y')) + Number(computer.attr('height'))
      }))
    .filter(({ leftSideBall, computerPaddleFace, ballY, topComputerPaddle, botComputerPaddle }) =>
      ((leftSideBall == computerPaddleFace) && ((ballY >= topComputerPaddle) && (ballY <= botComputerPaddle))))
    .subscribe(_ => {
      incrementX *= -1;//change direction
    });

  /**
   * This code controls reflection of the ball when it hits the top of the pong canvas
   */
  getBallObservableWithInterval(moveAndReflectInterval, ball)//This Interval must match ball movement's otherwise it will not reflect
    .map(({ ballY, radiusY }) => ({ topSideBall: ballY - radiusY }))
    .filter(({ topSideBall }) => topSideBall === pongCanvas.clientTop)
    .subscribe(() => {
      incrementY *= -1;//change direction
    });

  /**
   * This code controls reflection of the ball when it hits the bottom of the pong canvas 
   */
  getBallObservableWithInterval(moveAndReflectInterval, ball)//This Interval must match ball movement's otherwise it will not reflect
    .map(({ ballY, radiusY }) => ({ botSideball: ballY + radiusY }))
    .filter(({ botSideball }) => botSideball === pongCanvas.clientHeight)
    .subscribe(() => {
      incrementY *= -1;//change direction
    });
}



/**
 *This function controls the movement of the computer paddle using observables
 * @param computer The computer paddle element used in the game
 * @param ball The ball element used in the game
 */
function computerMovementObservable(computer: Elem, ball: Elem) {
  const
    pongCanvas = document.getElementById("canvas")!,
    computerMoveInterval = 5;


  /**
   * The computer paddle follows the ball. 
   */
  getBallObservableWithInterval(computerMoveInterval, ball)
    .map(({ ballY }) => ({ align: ballY - (Number(computer.attr("height")) / 2) }))
    .subscribe(({ align }) => computer.attr('y', align)); //align the middle of the computer paddle with the middle of the ball

  /**
   *  stops the computer paddle from going outside the bottom of the pong canvas
   */
  getBallObservableWithInterval(computerMoveInterval, ball) //This Interval must match computer paddle movement's interval; else flickering of computer paddle will occur
    .map(_ => ({ yComputer: Number(computer.attr('y')), yLimit: Number(pongCanvas.getAttribute("height")) - Number(computer.attr("height")) }))
    .filter(({ yComputer, yLimit }) => yComputer >= yLimit)
    .subscribe(({ yLimit }) => computer.attr("y", yLimit));

  /**
   *  stops the computer paddle from going outside the top of the pong canvas. 
   */
  getBallObservableWithInterval(computerMoveInterval, ball)
    .map(_ => ({ yComputer: Number(computer.attr('y')), yLimit: pongCanvas.clientTop }))
    .filter(({ yComputer, yLimit }) => yComputer <= yLimit)
    .subscribe(({ yLimit }) => computer.attr("y", yLimit));

}


function scoringObservable(ball: Elem) {
  const
    pongCanvas = document.getElementById("canvas")!,
    playerScore = document.getElementById("playerScore"),
    computerScore = document.getElementById("computerScore"),
    scoringInterval = 400;

  /**
  * Increment the computer score when the ball fully crosses the boundary on the player's side
  */
  getBallObservableWithInterval(scoringInterval, ball)//interval must be the same as returning ball to middle
    .map(({ ballX, radiusX }) => ({ leftSideBall: ballX - radiusX }))
    .filter(({ leftSideBall }) => ((leftSideBall > pongCanvas.clientWidth)))
    .subscribe(_ => { incrementScore(computerScore) });

  /**
  * Increment the player score when the ball crosses the boundary on the computer's side
  */
  getBallObservableWithInterval(scoringInterval, ball)//interval must be the same as returning ball to middle
    .map(({ ballX, radiusX }) => ({ rightSideBall: ballX + radiusX }))
    .filter(({ rightSideBall }) => rightSideBall < pongCanvas.clientLeft)
    .subscribe(_ => { incrementScore(playerScore) });

  /**
  * Return the ball to the middle after a goal (it goes beyond the left or right canvas boundaries)
  */
  getBallObservableWithInterval(scoringInterval, ball)//interval must be the same as  incrementing score; Otherwise the score will be incremented more than once for a goal. 
    .map(({ ballX, radiusX }) => ({ leftSideBall: ballX - radiusX, rightSideBall: ballX + radiusX }))
    .filter(({ leftSideBall, rightSideBall }) => ((leftSideBall >= pongCanvas.clientWidth) || (rightSideBall <= pongCanvas.clientLeft)))
    .subscribe(() => {
      ball.attr("cx", 300).attr("cy", getRandomStartingPosition(ball, pongCanvas));// IMPURE: calls an impure function - random number generator. 
    })
  /**
   * Display the winner when the player or computer reaches 11 points. 
   */
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
      const
        computerText = document.getElementById("alertComputerText"),
        computerWinnerText = document.getElementById("alertComputerWinnerText");
      if (computerText && computerWinnerText) {
        computerText.innerHTML = "Computer";
        computerWinnerText.innerHTML = "WINS";
      }
    }

  });
}



/**
   * This function returns a valid randomised number for the ball to start at after each goal.
   * 
   * @param ball The ball used for the game
   * @param pongCanvas The canvas of the pong game 
   */
function getRandomStartingPosition(ball: Elem, pongCanvas: HTMLElement): number { // Impure: Rangdom Number Generation. Anything that calls this is also impure
  const min = Number(ball.attr('ry'));
  const max = Number(pongCanvas.getAttribute("height")) - Number(ball.attr('ry'));
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
   * This function returns an Observable of the ball's attributes at a given interval. 
   * @param ms the interval between observable notifications (in milliseconds)
   * @param ball The ball used for the game.  
   */
function getBallObservableWithInterval(ms: number, ball: Elem) {
  return Observable.interval(ms).map(() => ({
    ballX: Number(ball.attr("cx")), ballY: Number(ball.attr("cy")),
    radiusX: Number(ball.attr("rx")), radiusY: Number(ball.attr("ry"))
  }));
}

/**
 * Increments the score of the player or computer
 * @param enity The html tag containing the score of the player or computer 
 */
function incrementScore(enity: HTMLElement | null): void {//Impure; changes the contents of the html tag of the player or computer score.
  if (enity) {
    var newScore = Number(enity.innerHTML);
    newScore++;
    enity.innerHTML = String(newScore);
  }
}

function isGameOver(playerScore: HTMLElement | null, computerScore: HTMLElement | null): boolean {//Pure; no changes only uses passed params for reading html tag contents
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

// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = () => {
    pong();
  }



