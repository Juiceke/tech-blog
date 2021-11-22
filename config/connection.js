const Sequelize = require("sequelize");

require("dotenv").config();

var sequelize = new Sequelize(config.database, config.username, config.password, config);

//create connection to the database
// const sequelize = process.env.JAWSDB_URL
//   ? new Sequelize(process.env.JAWSDB_URL)
//   : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
//       // host: "localhost",
//       dialect: "mysql",
//       protocol: 'mysql',
//       port: 3306,
//     });

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    logging:  true //false
  });
} else {
  // the application is executed on the local machine
  sequelize = new Sequelize("postgres:///my_db");
}

module.exports = sequelize;
