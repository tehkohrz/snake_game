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
  snakeDirection: '',
  score: 0,
  gameOver: false,
  inputDirection: WEST,
};
const gameSettings = {
  speed: 100,
  field_color: 'grey',
  snake_color: 'black',
  fruit_color: 'red',
  fieldSize: 48,
  startLength: 6,
};
let gameInstance;

export default {
  WEST, NORTH, SOUTH, EAST, gameSettings, gameInstance, gameState,
};
