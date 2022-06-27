import GAME from '../configVariables';
import { moveSnake, snakeControl } from './snakeFunctions';
import { fruitCheck, generateFruit } from './fruitsFunctions';

// GAME CONTROL/HANDLERS
// start snake movement
function startGameHandler() {
  // Toggle state of the game
  GAME.gameState.state = 1;
  // move snake every 1000ms (1s)
  GAME.gameInstance = setInterval(gameHandler, GAME.gameSettings.speed);
}
// stop snake movement
function stopGameHandler() {
  GAME.gameState.state = 0;
  clearInterval(GAME.gameInstance);
}

// Callback to bind snakeControls to keypress
// Listener hears for all key inputs hence controls have to tag to specific keys
function snakeControlHandler(event) {
  const inputKey = event.keyCode;
  if (inputKey === 32) {
    // stop if the game is running
    if (GAME.gameState.state) {
      stopGameHandler();
    } else {
      startGameHandler();
    }
  } else {
    snakeControl(inputKey, GAME.gameState.snakeDirection);
  }
}

function gameHandler() {
  // Move the snake body and check for extending snake
  GAME.gameState = moveSnake(GAME.gameState, GAME.gameSettings);
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
