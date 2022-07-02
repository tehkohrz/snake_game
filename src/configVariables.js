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
  speed: 50,
  field_color: '#808080',
  snake_color: '#000000',
  fruit_color: '#FF0000',
  fieldSize: 48,
  startLength: 6,
};
let gameInstance;

export default {
  WEST, NORTH, SOUTH, EAST, gameSettings, gameInstance, gameState,
};
