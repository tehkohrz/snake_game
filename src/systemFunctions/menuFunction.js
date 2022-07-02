import GAME from '../configVariables';

// Check for valid hex code
// Returns false for not hexcode
function checkHex(str) {
  // Check for first char #
  if (str[0] != '#') { return false; }
  if (!(str.length == 4 || str.length == 7)) {
    return false;
  }
  for (let i = 1; i < str.length; i++) {
    if (!((str[i].charCodeAt(0) <= '0'.charCodeAt(0) && str[i].charCodeAt(0) <= 9)
                   || (str[i].charCodeAt(0) >= 'a'.charCodeAt(0) && str[i].charCodeAt(0) <= 'f'.charCodeAt(0))
                   || (str[i].charCodeAt(0) >= 'A'.charCodeAt(0) && str[i].charCodeAt(0) <= 'F'.charCodeAt(0)))) return false;
  }
  return true;
}

// Event listener to trigger - check for valid settings else revert to last known value
function checkColorSettings(event) {
  const valid = checkHex(event.target.value);
  // if valid color update preview
  if (valid) {
    document.getElementById(`${event.target.id}_preview`).style.backgroundColor = event.target.value;
  } else {
    // Reset to old settings
    event.target.value = GAME.gameSettings[event.target.id];
  }
}

// Initialise

export { checkColorSettings };
