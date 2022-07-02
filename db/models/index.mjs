import sequelizePackage from 'sequelize';
// we give the name allConfig to what we're importing from config.js, i.e, our database settings
import allConfig from '../config/config.js';

import initUserModel from './user.mjs';
import initScoreModel from './score.mjs';

const { Sequelize } = sequelizePackage;
// in this case, "env" will be development, as we have in our config.js file
// process.env.NODE_ENV will be used later on in the course
const env = process.env.NODE_ENV || 'development';
// this is the same as saying :
// const config = allConfig['development']
const config = allConfig[env];

// initiate a new instance of Sequelize
// note similarity to pool.query

const sequelize = new Sequelize(
// database settings from config.js
  config.database,
  config.username,
  config.password,
  config,
);

// initiate models and instances
const db = {
  User: initUserModel(sequelize, Sequelize.DataTypes),
  Score: initScoreModel(sequelize, Sequelize.DataTypes),
  sequelize,
  Sequelize,
};

// There is no relation for the db
// db.User.hasMany(db.Score);
// db.Score.belongsTo(db.User);

export default db;
