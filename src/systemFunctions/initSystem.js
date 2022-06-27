import axios from 'axios';
import buttons from './buttonsCallbacks';
import GAME from '../configVariables';
import { checkColorSettings } from './menuFunction';

// Initialise settings modals with the loaded settings
function initSettingsModal(gameSettings) {
  // Update input tags
  document.getElementById(`${gameSettings.fieldSize}x${gameSettings.fieldSize}`).checked = true;
  document.getElementById('speed').value = 1000 / gameSettings.speed;
  document.getElementById('field_color').value = gameSettings.field_color;
  document.getElementById('snake_color').value = gameSettings.snake_color;
  document.getElementById('fruit_color').value = gameSettings.fruit_color;
  // Update the preview boxes on the side to show color selected
  document.getElementById('fruit_color_preview').style.backgroundColor = gameSettings.fruit_color;
  document.getElementById('snake_color_preview').style.backgroundColor = gameSettings.snake_color;
  document.getElementById('field_color_preview').style.backgroundColor = gameSettings.field_color;
}

function initMenuFunction() {
  // Add Eventlisteners
  document.getElementById('field_color').addEventListener('focusout', checkColorSettings);
  document.getElementById('snake_color').addEventListener('focusout', checkColorSettings);
  document.getElementById('fruit_color').addEventListener('focusout', checkColorSettings);
  document.getElementById('speed').addEventListener('focusout', (event) => {
    if (event.target.value < 1) {
      event.target.value = 1000 / GAME.gameSettings.speed;
    }
  });
}

// Init callbacks to modal buttons
function initButtonCallbacks() {
  document.getElementById('signUpBtn').onclick = buttons.signUpCallback;
  document.getElementById('logoutBtn').onclick = buttons.logoutCallback;
  document.getElementById('loginBtn').onclick = buttons.loginCallback;
  document.getElementById('saveSysBtn').onclick = buttons.saveSettingsCallback;
  document.getElementById('saveColorBtn').onclick = buttons.saveSettingsCallback;
}

// Init system by checking for login and adjusting the interface
export default async function initSystem() {
  try {
    // initalise button functions
    initMenuFunction();
    initButtonCallbacks();
    // Check for login
    const res = await axios.get('/checkLogin');
    // if logged in hide signup and login, update menu and game values
    if (res.data.loggedIn) {
      // Retrieve user settings
      const response = await axios.get('/getSettings');
      // load usersettings retrieved into menu
      initSettingsModal(response.data.settings);
      // Update local config settings using menu values
      GAME.gameSettings.fieldSize = document.querySelector('input[name="fieldSize"]:checked').value;
      GAME.gameSettings.speed = 1000 / document.getElementById('speed').value;
      GAME.gameSettings.field_color = document.getElementById('field_color').value;
      GAME.gameSettings.snake_color = document.getElementById('snake_color').value;
      GAME.gameSettings.fruit_color = document.getElementById('fruit_color').value;
      // hide signup and login buttons
      buttons.toggleLoginModals(true);
    } else {
      // load local settings into the menu
      initSettingsModal(GAME.gameSettings);
      // hide logout
      buttons.toggleLoginModals(false);
    }
  } catch (err) {
    console.log('Init Sys Error', err);
  }
}
