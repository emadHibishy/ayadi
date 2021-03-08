const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'online_shop',
    'root',
    '01146581234',{ 
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;