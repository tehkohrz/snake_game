import GAME from '../configVariables';
import { moveSnake, snakeControl } from './snakeFunctions';
import { fruitCheck, generateFruit } from './fruitsFunctions';
import { checkHighScore, renderHighscore, getHighScore } from './scoreFunctions';

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
  // spacebar for pause game
  if (inputKey === 32) {
    // stop if the game is running
    if (GAME.gameState.state === 1) {
      stopGameHandler();
      // changes to 0
    } else if (GAME.gameState.state === 0) {
      startGameHandler();
      // changes to 1
    }
  }
  snakeControl(inputKey, GAME.gameState.snakeDirection);
}

function gameHandler() {
  // Move the snake body and check for extending snake
  GAME.gameState = moveSnake(GAME.gameState, GAME.gameSettings);
  // Check for snake eating the fruit and add extension and score
  const toGenerateFruit = fruitCheck(GAME.gameState);
  // Fruit eaten generate new fruit
  if (toGenerateFruit) {
    GAME.gameState.fruit = generateFruit(GAME.gameSettings.fieldSize, GAME.gameState.snakeBody, GAME.gameSettings.fruit_color);
  }
  // Check for game over
  if (GAME.gameState.state < 0) {
    // Stop game movement
    clearInterval(GAME.gameInstance);
    // Render end screen
    handleGameOver();
  }
}

async function handleGameOver() {
  try {
  // Show overlay
    const overlay = document.getElementById('gameOverOverlay');
    overlay.style.display = 'block';
    // Default score message
    document.getElementById('playerScore').innerText = `Your Score: ${GAME.gameState.score}`;
    document.getElementById('playerScore').style.color = '';
    // Check highscore to personal score and get all highscores
    // Only check if it is a logged in user
    if (document.cookie) {
      const isHighscore = await checkHighScore(GAME.gameState.score);
      // Highlight new highscore
      if (isHighscore) {
        document.getElementById('playerScore').innerText = `New Highscore: ${GAME.gameState.score}`;
        document.getElementById('playerScore').style.color = 'red';
      }
    }
    const allHighscore = await getHighScore();
    renderHighscore(allHighscore);
  } catch (err) {
    console.log(err);
  }
}

export default {
  gameHandler, snakeControlHandler, stopGameHandler, startGameHandler, handleGameOver,
};
