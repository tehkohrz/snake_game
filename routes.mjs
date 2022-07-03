// import your controllers here
import { resolve } from 'path';
import db from './db/models/index.mjs';
import InitUserController from './controllers/userController.mjs';
import InitScoreController from './controllers/scoreController.mjs';

export default function bindRoutes(app) {
  const scoreController = new InitScoreController(db);
  const userController = new InitUserController(db);
  // main route
  app.get('/', (req, res) => {
    res.sendFile(resolve('dist', 'index.html'));
  });
  // USER CONTROLLERS/ROUTES
  // Check for existing login
  app.get('/checkLogin', userController.checkLogin);
  // Login user
  app.post('/login', userController.login);
  // Signup user
  app.post('/signup', userController.signUp);
  // Logout user
  app.get('/logout', userController.logout);
  // Get user's settings
  app.get('/getSettings', userController.getSettings);
  // Save settings
  app.post('/updateSettings', userController.updateSettings);
  // Get and update user's highscore
  app.post('/getScore', userController.updateUserScore);

  // SCORE CONTROLLERS/ROUTES
  // Get score from the community score board
  app.get('/highScore', scoreController.getHighscores);
  // Post score into the community board
  app.post('/postHighscore', scoreController.insertHighscore);
}
