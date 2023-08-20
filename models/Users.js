const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Users extends Model {

    }

    Users.init({
        full_name: {
            type: DataTypes.STRING,
            field: 'full_name'
        },
        user_email: {
            type: DataTypes.STRING,
            field: 'user_email'
        },
        password: {
            type: DataTypes.STRING,
            field: 'password'
        },
        contact_no: {
            type: DataTypes.STRING,
            field: 'contact_no'
        },
        user_type: {
            type: DataTypes.STRING,
            field: 'user_type'
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            field: 'isDelete',
            defaultValue: false,
        }
    }, {
        sequelize,
        tableName: 'users',
        modelName: 'Users',
        timestamps: true
    })
    return Users
}