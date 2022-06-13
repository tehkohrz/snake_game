import GAME from './configVariables';
import { moveSnake } from './snakeFunctions';
import { fruitCheck, generateFruit } from './fruitsFunctions';

// GAME CONTROL/HANDLERS
// start snake movement
function startGameHandler() {
  // move snake every 1000ms (1s)
  GAME.gameInstance = setInterval(gameHandler, GAME.gameSettings.speed);
}
// stop snake movement
function stopGameHandler() {
  clearInterval(GAME.gameInstance);
}

// Callback to bind snakeControls to keypress
function snakeControlHandler(event) {
  const inputKey = event.keyCode;
  const currentDirection = GAME.gameState.snakeDirection;
  GAME.gameState.inputDirection = snakeControl(inputKey, currentDirection);
}

function gameHandler() {
  // Move the snake body and check for extending snake
  moveSnake(GAME.gameState, GAME.gameSettings);
  // Check for snake eating the fruit and add extension and score
  const toGenerateFruit = fruitCheck(GAME.gameState);
  // Fruit eaten generate new fruit
  if (toGenerateFruit) {
    GAME.gameState.fruit = generateFruit(GAME.gameSettings.fieldSize, GAME.gameState.snakeBody);
  }
}

export default {
  gameHandler, snakeControlHandler, stopGameHandler, startGameHandler,
};
