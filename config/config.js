/* eslint-disable quote-props */
const { config } = require('dotenv');

config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL_DEV',
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false,
      // },
    },
  },
  test: {
    use_env_variable: 'DATABASE_URL_TEST',
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   // rejectUnauthorized: false,
      // }
    },
  },
  production: {
    use_env_variable: 'DATABASE_URL_PROD',
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   // rejectUnauthorized: false,
      // }
    },
  },
};
