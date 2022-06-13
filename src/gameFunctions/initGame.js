// Imports
import GAME from './configVariables';
import handlers from './gameHandlers';

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
  start.addEventListener('click', handlers.startGameHandler);
  document.body.appendChild(start);
  start.innerText = 'START';
  const stop = document.createElement('button');
  stop.addEventListener('click', handlers.stopGameHandler);
  document.body.appendChild(stop);
  stop.innerText = 'STOP';
  // Add event listeners for controls
  document.body.onkeyup = handlers.snakeControlHandler;
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
    cell.style.backgroundColor = GAME.gameSettings.snake_color;
  });
  GAME.gameState.snakeBody = [...snake];
  console.log('Snake body formed');
}

// INITIALISE THE GAME with default settings
function initGame(fieldSize, startLength) {
  createField(fieldSize);
  initSnake(startLength, fieldSize);
}
initGame(GAME.gameSettings.fieldSize, GAME.gameSettings.startLength);
