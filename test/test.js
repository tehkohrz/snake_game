// constant directions
const WEST = 'west';
const EAST = 'east';
const NORTH = 'north';
const SOUTH = 'south';

// snake global variables
let inputDirection = WEST;
/* eslint-disable prefer-const */
let gameState = {
  snakeBody: [],
  fruit: [],
  unaddedSnake: [],
  snakeDirection: '',
  score: 0,
  gameOver: false,
};
const gameSettings = {
  speed: 100,
  field_color: 'grey',
  snake_color: 'black',
  fruit_color: 'red',
  fieldSize: 48,
};
let gameInstance;

// create the grid for the play field
function createField(fieldSize) {
  const field = document.createElement('table');
  for (let j = 0; j < fieldSize; j += 1) {
    const row = document.createElement('tr');
    row.id = `row${j}`;
    for (let i = 0; i < fieldSize; i += 1) {
      const col = document.createElement('td');
      col.id = `X${i}Y${j}`;
      col.classList.add('cells');
      row.appendChild(col);
    }
    field.appendChild(row);
  }
  document.body.appendChild(field);
  // Test start button and stop button
  const start = document.createElement('button');
  start.addEventListener('click', startGame);
  document.body.appendChild(start);
  start.innerText = 'START';
  const stop = document.createElement('button');
  stop.addEventListener('click', stopGame);
  document.body.appendChild(stop);
  stop.innerText = 'STOP';
  // Add event listeners for controls
  document.body.onkeyup = snakeControlCallback;
}

// init the snake and start the location
function initSnake(length, fieldSize) {
  const snake = [];
  // finding the start location in the middle and save snake body location
  const snakeHead = (fieldSize) / 2;
  for (let i = 0; i < length; i += 1) {
    snake.push([snakeHead + i, snakeHead]);
  }
  // render the snake body into the grid
  snake.forEach((body) => {
    const cell = document.getElementById(`X${body[0]}Y${body[1]}`);
    cell.style.backgroundColor = gameSettings.snake_color;
  });
  return [...snake];
}

// start snake movement
function startGame() {
  // move snake every 1000ms (1s)
  gameInstance = setInterval(gameHandler, gameSettings.speed);
}
// stop snake movement
function stopGame() {
  clearInterval(gameInstance);
}

// @param {array} snakeHead
// @returns {array} new position of the head
function shiftNewHead(snakeHead, direction) {
  let newHead;
  if (direction === WEST) {
    newHead = [snakeHead[0] - 1, snakeHead[1]];
  }
  if (direction === EAST) {
    newHead = [snakeHead[0] + 1, snakeHead[1]];
  }
  if (direction === NORTH) {
    newHead = [snakeHead[0], snakeHead[1] - 1];
  }
  if (direction === SOUTH) {
    newHead = [snakeHead[0], snakeHead[1] + 1];
  }
  return newHead;
}

// Pop the tail and map the rest of the body as the rest
// movement of the snake depending on direction (global variable)
function moveSnake(gameState, settings) {
  let {
    unaddedSnake, snakeBody, gameOver, snakeDirection,
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
function snakeControlCallback(event) {
  const inputKey = event.keyCode;
  // arrow up 38, W 87
  if (inputKey === 38 || inputKey === 87) {
    if (gameState.snakeDirection === WEST || gameState.snakeDirection === EAST) {
      inputDirection = NORTH;
    }
  }
  // arrow down 39, S 83
  if (inputKey === 40 || inputKey === 83) {
    if (gameState.snakeDirection === WEST || gameState.snakeDirection === EAST) {
      inputDirection = SOUTH;
    }
  }
  // arrow right 87, D 68
  if (inputKey === 39 || inputKey === 68) {
    if (gameState.snakeDirection === NORTH || gameState.snakeDirection === SOUTH) {
      inputDirection = EAST;
    }
  }
  // arrow left 40, A 65
  if (inputKey === 37 || inputKey === 65) {
    if (gameState.snakeDirection === NORTH || gameState.snakeDirection === SOUTH) {
      inputDirection = WEST;
    }
  }
}

// initialise the game
function initGame(fieldSize) {
  createField(fieldSize);
  gameState.snakeBody = initSnake(6, fieldSize);
  gameState.fruit = generateFruit(fieldSize, gameState.snakeBody);
}
initGame(gameSettings.fieldSize);

// FRUIT GENERATOR
function generateFruit(fieldSize, snakeBody) {
  let fruitLocation = [];
  let validLocation = false;
  // generate random locations for fruit until the location is not the same as existing snake body
  while (!validLocation) {
    let verifiedLocation = true;
    // random number generator up to the fieldSize-1
    // Math.floor will at most get the fieldSize -1
    const xPosition = Math.floor(Math.random() * (fieldSize));
    const yPosition = Math.floor(Math.random() * (fieldSize));
    fruitLocation = [xPosition, yPosition];
    for (let i = 0; i < snakeBody.length; i += 1) {
      // fruit location matches part of the snakeBody
      if (snakeBody[i][0] === fruitLocation[0] && snakeBody[i][1] === fruitLocation[1]) {
        verifiedLocation = false;
        break;
      }
    }
    if (verifiedLocation) {
      validLocation = true;
    }
  }
  // Render the fruit out
  const fruit = document.getElementById(`X${fruitLocation[0]}Y${fruitLocation[1]}`);
  fruit.style.backgroundColor = gameSettings.fruit_color;
  return fruitLocation;
}

// CHECK FOR FRUIT EATING
function fruitCheck(state) {
  // check if the head coincides with the fruite location
  if (state.snakeBody[0][0] === state.fruit[0] && state.snakeBody[0][1] === state.fruit[1]) {
    // Push the fruit location to add the extra length from this location onwards
    state.unaddedSnake.push([state.fruit[0], state.fruit[1]]);
    state.score += 10;
    return true;
  }
  return false;
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
  console.log({
    wall,
  }, {
    body,
  });
  if (wall === true || body === true) {
    return true;
  }
  return false;
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
  clearInterval(gameInstance);
  console.log('GAMEOVER');
}

function gameHandler() {
  // Move the snake body and check for extending snake
  gameState = moveSnake(gameState, gameSettings);
  // Check for snake eating the fruit and add extension and score
  const toGenerateFruit = fruitCheck(gameState);
  // Fruit eaten generate new fruit
  if (toGenerateFruit) {
    gameState.fruit = generateFruit(gameSettings.fieldSize, gameState.snakeBody);
  }
}
