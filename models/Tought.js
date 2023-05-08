const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const User = require('./User')

const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    }
})

Tought.belongsTo(User) // Pertence a um usuário
User.hasMany(Tought) // Usuário pode ter vários pensamentos

module.exports = Tought