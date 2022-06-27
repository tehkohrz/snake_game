// constant directions
const WEST = 'west';
const EAST = 'east';
const NORTH = 'north';
const SOUTH = 'south';

// snake global variables
const gameState = {
  snakeBody: [],
  fruit: [],
  unaddedSnake: [],
  snakeDirection: WEST,
  score: 0,
  gameOver: false,
  inputDirection: WEST,
  state: 0,
};
const gameSettings = {
  speed: 100,
  field_color: '#808080',
  snake_color: '#FFFF',
  fruit_color: '#ff0000',
  fieldSize: 48,
  startLength: 6,
};
let gameInstance;

export default {
  WEST, NORTH, SOUTH, EAST, gameSettings, gameInstance, gameState,
};
