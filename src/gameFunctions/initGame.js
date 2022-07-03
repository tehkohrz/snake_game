// Imports
import GAME from '../configVariables';
import {
  generateFruit,
} from './fruitsFunctions';
import handlers from './gameHandlers';

// create the grid for the play field
function createField(fieldSize) {
  const field = document.createElement('table');
  field.id = 'field';
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
  document.getElementById('main').appendChild(field);
  // Test start button and stop button
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'buttonContainer';
  document.getElementById('main').appendChild(buttonContainer);
  const start = document.createElement('button');
  start.classList = 'btn btn-primary';
  start.addEventListener('click', handlers.startGameHandler);
  buttonContainer.appendChild(start);
  start.innerText = 'START';
  const stop = document.createElement('button');
  stop.classList = 'btn btn-primary';
  stop.addEventListener('click', handlers.stopGameHandler);
  buttonContainer.appendChild(stop);
  stop.innerText = 'STOP';
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
  return [...snake];
}

// Eventlistener tagged to the id = resetButton
function resetGame() {
  console.log('resetting');
  // Reset the gameState
  GAME.gameState.state = 0;
  GAME.gameState.score = 0;
  GAME.gameState.inputDirection = GAME.WEST;
  GAME.gameState.snakeDirection = GAME.WEST;
  GAME.gameState.gameOver = false;
  GAME.gameState.snakeBody = [];
  GAME.gameState.unaddedSnake = [];
  GAME.gameState.fruit = [];
  // Remove and re-render game
  document.getElementById('main').innerHTML = '';
  // Recreate game
  createField(GAME.gameSettings.fieldSize);
  GAME.gameState.snakeBody = initSnake(GAME.gameSettings.startLength, GAME.gameSettings.fieldSize);
  GAME.gameState.fruit = generateFruit(GAME.gameSettings.fieldSize, GAME.gameState.snakeBody, GAME.gameSettings.fruit_color);
  // Dismiss overlay
  const overlay = document.getElementById('gameOverOverlay');
  overlay.style.display = 'none';
}

// INITIALISE THE GAME with default settings
export default function initGame() {
  // Render the game
  createField(GAME.gameSettings.fieldSize);
  // Add event listeners for controls
  document.body.onkeyup = handlers.snakeControlHandler;
  document.getElementById('resetButton').addEventListener('click', resetGame);
  // Render start positions
  GAME.gameState.snakeBody = initSnake(GAME.gameSettings.startLength, GAME.gameSettings.fieldSize);
  GAME.gameState.fruit = generateFruit(GAME.gameSettings.fieldSize, GAME.gameState.snakeBody, GAME.gameSettings.fruit_color);
}
