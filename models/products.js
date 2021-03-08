const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true
    },
    price:{
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    image:{
        type: Sequelize.STRING,
        allowNull: false
    },
    describtion:{
        type: Sequelize.STRING,
        allowNull: false
    },
    type:{
        type: Sequelize.STRING,
        allowNull: false
    },likes:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});

module.exports = Product;