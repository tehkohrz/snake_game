import sequelizePackage from 'sequelize';
// we give the name allConfig to what we're importing from config.js, i.e, our database settings
import url from 'url';
import allConfig from '../../sequelize.config.cjs';
import initUserModel from './user.mjs';
import initScoreModel from './score.mjs';

const { Sequelize } = sequelizePackage;
// in this case, "env" will be development, as we have in our config.js file
// process.env.NODE_ENV will be used later on in the course
const env = process.env.NODE_ENV || 'development';
// this is the same as saying :
// const config = allConfig['development']
const config = allConfig[env];
let sequelize;

// If env is production, retrieve database auth details from the
// DATABASE_URL env var that Heroku provides us
if (env === 'production') {
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(dbUrl.auth.indexOf(':') + 1, dbUrl.auth.length);
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
}
// Not production
else {
  sequelize = new Sequelize(
    // database settings from config.js
    config.database,
    config.username,
    config.password,
    config,
  );
}

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
