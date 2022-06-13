import GAME from './configVariables';

// FRUIT GENERATOR
export function generateFruit(fieldSize, snakeBody) {
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
  fruit.style.backgroundColor = GAME.gameSettings.fruit_color;
  return fruitLocation;
}

// CHECK FOR FRUIT EATING
export function fruitCheck(state) {
  // check if the head coincides with the fruite location
  if (state.snakeBody[0][0] === state.fruit[0] && state.snakeBody[0][1] === state.fruit[1]) {
    // Push the fruit location to add the extra length from this location onwards
    state.unaddedSnake.push([state.fruit[0], state.fruit[1]]);
    state.score += 10;
    return true;
  }
  return false;
}
