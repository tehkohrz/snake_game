module.exports = {
// development settings, other settings include staging and production settings which we have not included here
  development: {
    username: 'tehkohrz',
    password: null,
    database: 'snake_game',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  // Production config for deployment to heroku
  production: {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: { // https://github.com/sequelize/sequelize/issues/12083
      require: true,
      rejectUnauthorized: false,
    },
  },
},
};
