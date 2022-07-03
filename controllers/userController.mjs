import auth from './functions/authentication.mjs';

export default class InitUserController {
  constructor(db) {
    this.db = db;
  }

  // Signup Handler
  signUp = async (req, res) => {
    try {
      const database = this.db;
      // Hash password for storage
      const password = auth.getHash(req.body.password);
      // Retrieve current userSettings as an object and store
      const { settings } = req.body;
      // Check for exisitng username
      const userExist = await database.User.findOne({
        where: {
          name: req.body.username,
        },
      });
      if (userExist) {
        throw new Error('User already exist');
      }
      // Create user entry
      const newUser = await database.User.create({
        id,
        name: req.body.username,
        password,
        highScore: 0,
        settings,
        created_at: Date.now(),
        updated_at: Date.now(),
      });
      console.log('created new user', newUser);
      const session = auth.getHash(newUser.name);
      res.cookie('username', newUser.name);
      res.cookie('session', session);
      res.json({ newUser });
    } catch (err) {
      // Return error that will as the user to re-entry?
      console.log('Catch signup', err);
      res.send({ err });
    }
  };

  //  Login handler and checker
  login = async (req, res) => {
    try {
      const database = this.db;
      const userData = await database.User.findOne({
        where: {
          name: req.body.username,
        },
      });
      // Throw error if user is not found
      if (!userData) {
        throw new Error('User not found');
      }
      // Check for matching password
      const validLogin = auth.checkHash(req.body.password, userData.password);
      if (!validLogin) {
        throw new Error('Wrong password');
      }
      // Create and log session hash
      const session = auth.getHash(userData.name);
      res.cookie('username', userData.name);
      res.cookie('session', session);
      res.json({ session });
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  };

  // Logout handler
  logout = async (req, res) => {
    try {
      res.clearCookie('username');
      res.clearCookie('session');
      // must send if not the action is not sent to the cilent
      res.send();
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  };

  // Update user settings
  updateSettings = async (req, res) => {
    try {
      const database = this.db;
      // Get user instance
      const user = await database.User.findOne({
        where: {
          name: req.cookies.username,
        },
      });
      // Update new settings
      user.settings = req.body.settings;
      user.save();
      console.log(user);
      // Send settings back? May not need i can just update the gamestate straight.
      res.json(user.settings);
    } catch (err) {
      console.log('Update Settings Error', err);
    }
  };

  // Check for loggedin
  checkLogin = (req, res) => {
    let loggedIn = false;
    // Check for cookies
    if (req.cookies.username && req.cookies.session) {
      const sessionHash = auth.getHash(req.cookies.username);
      if (req.cookies.session === sessionHash) {
        loggedIn = true;
      }
    }
    res.json({ loggedIn });
  };

  getSettings = async (req, res) => {
    try {
      const database = this.db;
      const userData = await database.User.findOne({
        where: {
          name: req.cookies.username,
        },
      });
      res.json(userData);
    } catch (err) {
      console.log('Retrieve settings error', err);
    }
  };

  updateUserScore = async (req, res) => {
    try {
      const database = this.db;
      const user = await database.User.findOne({
        where: {
          name: req.cookies.username,
        },
      });
      console.log(req.body.score);
      // compare new and old score
      if (req.body.score > user.highScore) {
        user.highScore = req.body.score;
        user.save();
        res.send(true);
      } else {
        res.send(false);
      }
    } catch (err) {
      console.log('updateScore Error', err);
    }
  };
}
