import axios from 'axios';
import GAME from '../configVariables';
import initGame from '../gameFunctions/initGame';

// SIGNUP BUTTON - callback to insert the new user into db
function signUpCallback() {
  const username = document.getElementById('signUpUsername').value;
  const password = document.getElementById('signUpPassword').value;
  const data = {
    username,
    password,
    settings: GAME.gameSettings,
  };
  // Check for existing username
  axios
    .post('/signup', data)
    .then((res) => {
      console.log(res);
      if (res.data.newUser) {
        // Hide signup and login modals/buttons
        toggleLoginModals(true);
        autoCloseModal(this.id);
        // Add username to the front of logout
        const userElement = document.createElement('h3');
        userElement.id = 'usernameElement';
        userElement.innerText = username;
        document.getElementById('logoutBtn').before(userElement);
      }
    })
    .catch((err) => {
      console.log('signup error', err);
      if (err.message === 'User already exist') {
        const errorMsg = document.createElement('h3');
        errorMsg.classList.add('errorMsg');
        errorMsg.innerText = 'Username already exist.';
        document.getElementById('signUpPassword').after(errorMsg);
      }
    });
}

// LOGIN BUTTON
function loginCallback() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const data = {
    username,
    password,
  };
  // retrieve user data and check for password match
  axios.post('/login', data)
    .then((res) => {
      // only if login is true
      if (res.data.session) {
      // Hide signup and login modals/buttons
        toggleLoginModals(true);
        autoCloseModal(this.id);
        // Add username to the front of logout
        const userElement = document.createElement('h3');
        userElement.id = 'usernameElement';
        userElement.innerText = username;
        document.getElementById('logoutBtn').before(userElement);
      }
    })
    .catch((err) => {
      if (err.message === 'Wrong password') {
        const errorMsg = document.createElement('h3');
        errorMsg.classList.add('errorMsg');
        errorMsg.innerText = err.message;
        document.getElementById('loginPassword').after(errorMsg);
      }
      if (err.message === 'User not found') {
        const errorMsg = document.createElement('h3');
        errorMsg.classList.add('errorMsg');
        errorMsg.innerText = err.message;
        document.getElementById('loginUsername').after(errorMsg);
      }
    });
}

// LOGOUT BUTTON
async function logoutCallback() {
  try {
    // axios call to remove cookies
    axios.get('/logout');
    toggleLoginModals(false);
    // Remove the logged in elements
    document.getElementById('usernameElement').remove();
  } catch (err) {
    console.log('Error in logout', err);
  }
}

// SAVE SETTING BUTTON
async function saveSettingsCallback() {
  try {
    // Update settings into the game instance
    GAME.gameSettings.fieldSize = document.querySelector('input[name="fieldSize"]:checked').value;
    GAME.gameSettings.speed = 1000 / document.getElementById('speed').value;
    GAME.gameSettings.field_color = document.getElementById('field_color').value;
    GAME.gameSettings.snake_color = document.getElementById('snake_color').value;
    GAME.gameSettings.fruit_color = document.getElementById('fruit_color').value;
    //  Check for loggedIn returns loggedIn: true
    const res = await axios.get('/checkLogin');
    const data = {
      settings: GAME.gameSettings,
    };
    // update db if valid logged in user
    if (res.data.loggedIn) {
      console.log('Updating Settings');
      axios.post('/updateSettings', data);
    }
    // Reload the game with the new settings
    // Remove existing field
    document.getElementById('field').remove();
    document.getElementById('buttonContainer').remove();
    // Load new field
    initGame(GAME.gameSettings.fieldSize, GAME.gameSettings.startLength);
    autoCloseModal(this.id);
  } catch (err) {
    console.log('checklogin', err);
  }
}

// Hides modals and show logout btn when loggedIn is true
function toggleLoginModals(toggle) {
  // Click to dismiss the modal first
  document.getElementById('signUpModalBtn').hidden = toggle;
  document.getElementById('signUpModal').hidden = toggle;
  document.getElementById('loginModalBtn').hidden = toggle;
  document.getElementById('loginModal').hidden = toggle;
  // clear input fields
  document.getElementById('signUpPassword').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('signUpUsername').value = '';
  document.getElementById('loginUsername').value = '';
  // clear error msgs if any
  const errorMsgs = document.getElementsByClassName('errorMsg');
  if (errorMsgs.length > 0) {
    errorMsgs.forEach((ele) => ele.remove());
  }
  // Toggle logout button display
  document.getElementById('logoutBtn').hidden = !toggle;
}

// Update settings modals with the loaded settings
function updateSettingsModal(gameSettings) {
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

export default {
  saveSettingsCallback, logoutCallback, loginCallback, signUpCallback, toggleLoginModals, updateSettingsModal,
};

function autoCloseModal(buttonId) {
  let modalId = '';
  switch (buttonId) {
    case 'saveColorBtn':
      modalId = 'gameColorModal';
      break;
    case 'saveSysBtn':
      modalId = 'gameSettingsModal';
      break;
    case 'loginBtn':
      modalId = 'loginModal';
      break;
    case 'signUpBtn':
      modalId = 'signUpModal';
      break;
    default:
      modalId = 'loginModal';
  }
  document.getElementById(modalId).click();
}
