const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Password_reset extends Model { }
    Password_reset.init({
        email: {
            type: DataTypes.STRING,
            field: 'email'
        },
        otp: {
            type: DataTypes.STRING,
            field: 'otp'
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'createdAt'
        },
        expireAt: {
            type: DataTypes.DATE,
            field: 'expireAt'
        }
    }, {
        sequelize,
        tableName: 'password_reset',
        modelName: 'Password_reset',
        timestamps: false
    })
    return Password_reset
}