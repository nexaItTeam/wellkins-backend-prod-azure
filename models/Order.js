const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model { }
    Order.init({
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
            type: DataTypes.BOOLEAN,
            field: 'paidStatus'
        },
        investing_amount: {
            type: DataTypes.INTEGER,
            field: 'investing_amount'
        }
    }, {
        sequelize,
        tableName: 'order',
        modelName: 'Order',
        timestamps: true
    })
    return Order
}