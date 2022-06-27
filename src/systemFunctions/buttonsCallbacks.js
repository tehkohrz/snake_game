import axios from 'axios';
import GAME from '../configVariables';

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
    .post('/signUp', data)
    .then((res) => {
      if (res.data) {
        // Hide signup and login modals/buttons
        toggleLoginModals(true);
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
  axios.get('/login', data)
    .then((res) => {
      // Hide signup and login modals/buttons
      toggleLoginModals(true);
      // Add username to the front of logout
      const userElement = document.createElement('h3');
      userElement.id = 'usernameElement';
      userElement.innerText = username;
      document.getElementById('logoutBtn').before(userElement);
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
function logoutCallback() {
  // axios call to remove cookies
  axios('/logout')
    .then((res) => {
      // insert back signup and login buttons
      toggleLoginModals(false);
    })
    .catch((err) => {
      console.log('Error in logout', err);
    });
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
      axios.post('/updateSettings', data);
    }
    // Reload the game with the new settings
    // Remove existing field
    document.getElementById('field').remove();
    document.getElementById('buttonContainer').remove();
    // Load new field
    initGame(GAME.gameSettings.fieldSize, GAME.gameSettings.startLength);
  } catch (err) {
    console.log('checklogin', err);
  }
}

// Hides modals and show logout btn when loggedIn is true
function toggleLoginModals(toggle) {
  // Click to dismiss the modal first
  document.getElementById('loginModal').click();
  document.getElementById('signUpBtn').hidden = toggle;
  document.getElementById('signUpModal').hidden = toggle;
  document.getElementById('loginBtn').hidden = toggle;
  document.getElementById('loginModal').hidden = toggle;
  // clear input fields
  document.getElementById('signUpPassword').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('signUpUsername').value = '';
  document.getElementById('loginUsername').value = '';
  // clear error msgs if any
  const errorMsgs = document.getElementsByClassName('errorMsg');
  if (errorMsgs) {
    errorMsgs.forEach((ele) => ele.remove());
  }
  // Toggle logout button opp of the rest
  document.getElementById('logoutBtn').hidden = !toggle;
  document.getElementById('usernameElement').remove();
}

export default {
  saveSettingsCallback, logoutCallback, loginCallback, signUpCallback, toggleLoginModals,
};
