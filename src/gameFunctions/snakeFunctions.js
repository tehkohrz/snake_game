import GAME from './configVariables';

// SNAKE FUNCTIONS
// @param {array} snakeHead
// @returns {array} new position of the head
function shiftNewHead(snakeHead, snakeDirection) {
  let newHead;
  if (snakeDirection === GAME.WEST) {
    newHead = [snakeHead[0] - 1, snakeHead[1]];
  }
  if (snakeDirection === GAME.EAST) {
    newHead = [snakeHead[0] + 1, snakeHead[1]];
  }
  if (snakeDirection === GAME.NORTH) {
    newHead = [snakeHead[0], snakeHead[1] - 1];
  }
  if (snakeDirection === GAME.SOUTH) {
    newHead = [snakeHead[0], snakeHead[1] + 1];
  }
  return newHead;
}

// Shifts the snake body accroding to the direction render and derender body
// @params {object} gameState
// @params {object} settings
// @returns {object} newGameState
export function moveSnake(gameState, settings) {
  let {
    unaddedSnake, snakeBody, gameOver, snakeDirection, inputDirection,
  } = gameState;
  let dropTail = true;
  // Do a check if there is unaddedSnake
  if (unaddedSnake.length > 0) {
    const tail = snakeBody[snakeBody.length - 1];
    // Dont pop tail if the tail is at the unadded location
    // just need to check the snake tail and the first part of the unaddedSnake
    if (tail[1] === unaddedSnake[0][1] && tail[1] === unaddedSnake[0][1]) {
      console.log('Snake extended');
      // Remove the unadded portion
      unaddedSnake.shift();
      dropTail = false;
    }
  }
  // pop tail off if not at fruit location and unrender
  if (dropTail) {
    const tail = document.getElementById(`X${snakeBody[snakeBody.length - 1][0]}Y${snakeBody[snakeBody.length - 1][1]}`);
    tail.style.backgroundColor = settings.field_color;
    snakeBody.pop();
  }
  snakeDirection = inputDirection;
  // move head according to current direction and insert to the front of the array
  snakeBody.unshift(shiftNewHead(snakeBody[0], snakeDirection));
  // Check for gameOver conditions
  gameOver = gameOverCheck(snakeBody, settings.fieldSize);
  if (gameOver) {
    snakeDeath(snakeBody);
  } else {
    // not gameOver move snakeHead if not will throw error
    const snakeHeadElement = document.getElementById(`X${snakeBody[0][0]}Y${snakeBody[0][1]}`);
    snakeHeadElement.style.backgroundColor = settings.snake_color;
  }
  const newGameState = {
    unaddedSnake,
    snakeBody,
    gameOver,
    snakeDirection,
    fruit: gameState.fruit,
    score: gameState.score,
    inputDirection: gameState.inputDirection,
  };
  return newGameState;
}

// Snake controls
export function snakeControl(inputKey, snakeDirection) {
  let inputDirection;
  // arrow up 38, W 87
  if (inputKey === 38 || inputKey === 87) {
    if (snakeDirection === GAME.WEST || snakeDirection === GAME.EAST) {
      inputDirection = GAME.NORTH;
    }
  }
  // arrow down 39, S 83
  if (inputKey === 40 || inputKey === 83) {
    if (snakeDirection === GAME.WEST || snakeDirection === GAME.EAST) {
      inputDirection = GAME.SOUTH;
    }
  }
  // arrow right 87, D 68
  if (inputKey === 39 || inputKey === 68) {
    if (snakeDirection === GAME.NORTH || snakeDirection === GAME.SOUTH) {
      inputDirection = GAME.EAST;
    }
  }
  // arrow left 40, A 65
  if (inputKey === 37 || inputKey === 65) {
    if (snakeDirection === GAME.NORTH || snakeDirection === GAME.SOUTH) {
      inputDirection = GAME.WEST;
    }
  }
  return inputDirection;
}

// Changes the snake for death
function snakeDeath(snakeBody) {
  // need to remove the head if collided with the wall else error on color change
  snakeBody.shift();
  snakeBody.forEach((part) => {
    const partElement = document.getElementById(`X${part[0]}Y${part[1]}`);
    partElement.style.backgroundColor = 'red';
  });
  // Stop game movement
  clearInterval(GAME.gameInstance);
  console.log('GAMEOVER');
}

// Collision check with the snake body to end the game
function bodyCollisionCheck(snakeBody) {
  const snakeHead = snakeBody[0];
  for (let i = 1; i < snakeBody.length; i += 1) {
    const body = snakeBody[i];
    // check if they occupy the same space
    if (snakeHead[0] === body[0] && snakeHead[1] === body[1]) {
      return true;
    }
  }
  return false;
}

// Collision check with wall to end the game
function wallCollisionCheck(snakeHead, fieldSize) {
  let collision = false;
  snakeHead.forEach((num) => {
    if (num < 0 || num > fieldSize - 1) {
      // console.log('Hit');
      collision = true;
    }
  });
  // console.log('No Hit')
  return collision;
}
// Checks gameOver conditions
function gameOverCheck(snakeBody, fieldSize) {
  // todo: ADD OVERFLOW CONDITION FOR WALL CHECK
  const wall = wallCollisionCheck(snakeBody[0], fieldSize);
  const body = bodyCollisionCheck(snakeBody);
  if (wall === true || body === true) {
    return true;
  }
  return false;
}
