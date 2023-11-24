const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.Enquiry_form, {
                foreignKey: "enq_form_id",
                as: 'enq_form_data'
            })

            Order.belongsTo(models.Client, {
                foreignKey: "client_id",
                as: 'enq_client_data'
            })

            Order.belongsTo(models.Property, {
                foreignKey: "prop_id",
                as: 'enq_prop_data'
            })
        }
    }
    Order.init({
        order_id: {
            type: DataTypes.STRING,
            field: 'order_id'
        },
        enq_form_id: {
            type: DataTypes.INTEGER,
            field: 'enq_form_id'
        },
        client_id: {
            type: DataTypes.INTEGER,
            field: 'client_id'
        },
        prop_id: {
            type: DataTypes.INTEGER,
            field: 'prop_id'
        },
        paidStatus: {
            type: DataTypes.INTEGER,
            field: 'paidStatus'
        },
        investing_amount: {
            type: DataTypes.INTEGER,
            field: 'investing_amount'
        },
        holder_type: {
            type: DataTypes.STRING,
            field: 'holder_type'
        },
        isEamil: {
            type: DataTypes.BOOLEAN,
            field: 'isEamil',
            defaultValue: false,
        },
        investment_unit: {
            type: DataTypes.INTEGER,
            field: 'investment_unit'
        },
    }, {
        sequelize,
        tableName: 'order',
        modelName: 'Order',
        timestamps: true
    })
    return Order
}