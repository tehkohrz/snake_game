// import your controllers here
import { resolve } from 'path';
import db from './models/index.mjs';
import InitUserController from './controllers/userController.mjs';
import InitScoreController from './controllers/scoreController.mjs';

export default function bindRoutes(app) {
  const scoreController = new InitScoreController(db);
  const userController = new InitUserController(db);
  // main route
  app.get('/', (req, res) => {
    res.sendFile(resolve('dist', 'index.html'));
  });
}
