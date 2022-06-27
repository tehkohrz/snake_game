import {
  v4 as uuidv4,
} from 'uuid';
import {
  checkHash,
  getHash,
} from './functions/authentication';

export default class InitUserController {
  constructor(db) {
    this.db = db;
  }

  // Signup Handler
  signUp = async (req, res) => {
    try {
      const database = this.db;
      // Generate UUID
      const id = uuidv4();
      // Hash password for storage
      const password = getHash(req.body.password);
      // Retrieve current userSettings as an object and store
      const settings = req.body.gameSettings;
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
        score: 0,
        settings,
        created_at: Date.now(),
        updated_at: Date.now(),
      });
      res.json(newUser);
    } catch (err) {
      // Return error that will as the user to re-entry?
      console.log('failed signup');
      res.send(err);
    }
  };

  //  Login handler and checker
  login = async (req, res) => {
    try {
      const database = this.db;
      const userData = await database.User.findOne({
        where: {
          id: req.body.id,
        },
      });
      // Throw error if user is not found
      if (!userData) {
        throw new Error('User not found');
      }
      // Check for matching password
      const validLogin = checkHash(req.body.password, userData.password);
      if (!validLogin) {
        throw new Error('Wrong password');
      }
      // Create and log session hash
      const session = getHash(userData.name);
      res.cookie('username', userData.name);
      res.cookie('session', session);
      res.json(session);
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
      const user = database.User.findOne({
        where: {
          name: req.cookies.username,
        },
      });
      // Update new settings
      user.settings = req.body.settings;
      user.save();
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
      const sessionHash = getHash(req.cookies.username);
      if (req.cookies.session === sessionHash) {
        loggedIn = true;
      }
    }
    res.json({ loggedIn });
  };

  getSettings = async (req, res) => {
    try {
      const database = this.db;
      const { settings } = database.User.findOne({
        where: {
          name: req.cookies.username,
        },
      });
      res.json({ settings });
    } catch (err) {
      console.log('Retrieve settings error', err);
    }
  };
}
