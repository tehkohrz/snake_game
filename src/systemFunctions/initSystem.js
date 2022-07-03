import axios from 'axios';
import buttons from './buttonsCallbacks';
import GAME from '../configVariables';
import { checkColorSettings } from './menuFunction';

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
    buttons.toggleLoginModals(false);
    const res = await axios.get('/checkLogin');
    // if logged in hide signup and login, update menu and game values
    if (res.data.loggedIn) {
      console.log('Load user settings');
      // Retrieve user settings
      const response = await axios.get('/getSettings');
      // load usersettings retrieved into menu
      buttons.updateSettingsModal(response.data.settings);
      // Update local config settings using menu values
      GAME.gameSettings.fieldSize = document.querySelector('input[name="fieldSize"]:checked').value;
      GAME.gameSettings.speed = 1000 / document.getElementById('speed').value;
      GAME.gameSettings.field_color = document.getElementById('field_color').value;
      GAME.gameSettings.snake_color = document.getElementById('snake_color').value;
      GAME.gameSettings.fruit_color = document.getElementById('fruit_color').value;
      // hide signup and login buttons
      buttons.toggleLoginModals(true);
      // Add username to the front of logout
      const userElement = document.createElement('h3');
      userElement.id = 'usernameElement';
      userElement.innerText = response.data.name;
      document.getElementById('logoutBtn').before(userElement);
    } else {
      console.log('Loaded default settings');
      // load local settings into the menu
      buttons.updateSettingsModal(GAME.gameSettings);
      // hide logout
      buttons.toggleLoginModals(false);
    }
  } catch (err) {
    console.log('Init Sys Error', err);
  }
}
