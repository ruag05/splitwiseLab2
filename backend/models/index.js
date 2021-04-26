'use strict';

//will allow to access and interact with the file system on the computer
const fs = require('fs');

//module to helper functions to make path manipulation easier
const path = require('path');

const Sequelize = require('sequelize');

//will return last portion (filename part) of the path passed in
const basename = path.basename(__filename);

//process.env represents state of system environment the application is running in and
//is a global variable injected by Node at runtime
//NODE_ENV is a system environment variable exposed by Node js, into running scripts
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

//check if an environment variable is set..If yes, then use settings for that env variable
//else use alternate settings.
//use_env_variable: used to identify which db configuration to use
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//will read content of __dirname directory
//will return array of all files names/objects in the directory
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    
    return (db[model.name] = model);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//the code will drop the tables and re-create them
//NOTE: MAKE SURE TO COMMENT IT AFTER FIRST RUN
// db.sequelize.sync({force:true});

//check the current state of the table in the db
//then perform necessary changes in table to make it match the model
//i.e., model schema -> table schema
// db.sequelize.sync({ alter: true, logging: true });

module.exports = db;
