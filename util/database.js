const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-e-commerce', 'root', '050899', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;