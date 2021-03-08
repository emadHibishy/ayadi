const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    image:{
        type:Sequelize.STRING,
        defaultValue:'image/male-avatar-profile-picture-silhouette-light-vector-5351605.jpg'
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    phone:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    type:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = User;