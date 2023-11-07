const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Property extends Model {
        static associate(models) {
            Property.hasOne(models.Enquery, {
                foreignKey: "property_id",
            })

            Property.hasOne(models.Order, {
                foreignKey: "prop_id",
            })
            Property.hasOne(models.Favourite, {
                foreignKey: "prop_id",
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
        pds: {
            type: DataTypes.STRING,
            field: 'pds'
        },
        spds: {
            type: DataTypes.STRING,
            field: 'spds'
        },
        tdm: {
            type: DataTypes.STRING,
            field: 'tdm'
        },
        fsg: {
            type: DataTypes.STRING,
            field: 'fsg'
        },
        price_per_share: {
            type: DataTypes.INTEGER,
            field: 'price_per_share'
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            field: 'isDelete',
            defaultValue: false,
        },
        isDocument: {
            type: DataTypes.BOOLEAN,
            field: 'isDelete',
            defaultValue: false
        },
        state: {
            type: DataTypes.STRING,
            field: 'state'
        },
        prop_type: {
            type: DataTypes.INTEGER,
            field: 'prop_type'
        },
        first_installment_price: {
            type: DataTypes.INTEGER,
            field: 'first_installment_price'
        }
    }, {
        sequelize,
        tableName: 'property',
        modelName: 'Property',
        timestamps: true
    })
    return Property
}