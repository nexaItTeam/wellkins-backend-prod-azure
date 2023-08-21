const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Property extends Model {
        static associate(models) {
            Property.hasOne(models.Enquery, {
                foreignKey: "property_id",
            })
        }
    }

    Property.init({
        property_name: {
            type: DataTypes.STRING,
            field: 'property_name'
        },
        property_address: {
            type: DataTypes.STRING,
            field: 'property_address'
        },
        returns: {
            type: DataTypes.STRING,
            field: 'returns'
        },
        LVR: {
            type: DataTypes.STRING,
            field: 'LVR'
        },
        term: {
            type: DataTypes.STRING,
            field: 'term'
        },
        facility: {
            type: DataTypes.STRING,
            field: 'facuility'
        },
        status: {
            type: DataTypes.STRING,
            field: 'status'
        },
        desc: {
            type: DataTypes.STRING,
            field: 'desc'
        },
        brocher: {
            type: DataTypes.STRING,
            field: 'brocher'
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            field: 'isDelete',
            defaultValue: false,
        }
    }, {
        sequelize,
        tableName: 'property',
        modelName: 'Property',
        timestamps: true
    })
    return Property
}