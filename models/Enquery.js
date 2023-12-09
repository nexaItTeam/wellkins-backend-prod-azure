const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Enquery extends Model {
        static associate(models) {
            Enquery.belongsTo(models.Property, {
                foreignKey: "property_id",
                as: 'prop_data'
            })

            Enquery.hasOne(models.Order, {
                foreignKey: "enq_form_id",
            })
        }
    }

    Enquery.init({
        full_name: {
            type: DataTypes.STRING,
            field: 'full_name'
        },
        user_email: {
            type: DataTypes.STRING,
            field: 'user_email'
        },
        contact_no: {
            type: DataTypes.STRING,
            field: 'contact_no'
        },
        location: {
            type: DataTypes.STRING,
            field: 'location'
        },
        description: {
            type: DataTypes.STRING,
            field: 'description'
        },
        property_id: {
            type: DataTypes.INTEGER,
            field: 'property_id'
        },
        invest: {
            type: DataTypes.STRING,
            field: 'invest'
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            field: 'isDelete',
            defaultValue: false,
        },
        status: {
            type: DataTypes.INTEGER,
            field: 'status'
        },
        assignTo: {
            type: DataTypes.INTEGER,
            field: 'assignTo'
        },
        fund_type: {
            type: DataTypes.STRING,
            field: 'fund_type'
        },
        isActiveEnq: {
            type: DataTypes.BOOLEAN,
            field: 'isActiveEnq',
            defaultValue: false
        }
    }, {
        sequelize,
        tableName: 'enquery',
        modelName: 'Enquery',
        timestamps: true
    })
    return Enquery
}