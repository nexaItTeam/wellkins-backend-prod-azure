const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Client extends Model {
        static associate(models) {
            Client.hasOne(models.Order, {
                foreignKey: "client_id",
            })
        }
    }
    Client.init({
        full_name: {
            type: DataTypes.STRING,
            field: 'full_name'
        },
        password: {
            type: DataTypes.STRING,
            field: 'password'
        },
        client_email: {
            type: DataTypes.STRING,
            field: 'client_email'
        },
        contact_no: {
            type: DataTypes.STRING,
            field: 'contact_no'
        },
        client_id: {
            type: DataTypes.INTEGER,
            field: 'client_id'
        },
        active: {
            type: DataTypes.INTEGER,
            field: 'active'
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            field: 'isDelete',
            defaultValue: false,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            field: 'isVerified',
            defaultValue: false,
        },

    }, {
        sequelize,
        tableName: 'client',
        modelName: 'Client',
        timestamps: true
    })
    return Client
}