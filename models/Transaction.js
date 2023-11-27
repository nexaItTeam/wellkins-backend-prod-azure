const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
        static associate(models) {
            // cleint
            Transaction.belongsTo(models.Client, {
                foreignKey: "client_id",
                as: 'client_data'
            })
            // order
            Transaction.belongsTo(models.Order, {
                foreignKey: "order_id",
                as: 'order_data'
            })
            // enquery form
            Transaction.belongsTo(models.Enquiry_form, {
                foreignKey: "enq_form_id",
                as: 'enq_form_data'
            })
            // property
            Transaction.belongsTo(models.Property, {
                foreignKey: "prop_id",
                as: 'prop_data'
            })
        }
    }
    Transaction.init({
        client_id: {
            type: DataTypes.INTEGER,
            field: 'client_id'
        },
        order_id: {
            type: DataTypes.INTEGER,
            field: 'order_id'
        },
        enq_form_id: {
            type: DataTypes.INTEGER,
            field: 'enq_form_id'
        },
        prop_id: {
            type: DataTypes.INTEGER,
            field: 'prop_id'
        },
        investment_unit: {
            type: DataTypes.INTEGER,
            field: 'investment_unit'
        },
        investing_amount: {
            type: DataTypes.INTEGER,
            field: 'investing_amount'
        },
        transaction_date: {
            type: DataTypes.DATE,
            field: 'transaction_date'
        },
        transaction_type: {
            type: DataTypes.STRING,
            field: 'transaction_type',
            defaultValue: "Allotment",
        },
        units_acquired: {
            type: DataTypes.INTEGER,
            field: 'units_acquired'
        },
        units_transferred: {
            type: DataTypes.INTEGER,
            field: 'units_transferred'
        },
        units_balance: {
            type: DataTypes.INTEGER,
            field: 'units_balance'
        },
        amount_paid: {
            type: DataTypes.INTEGER,
            field: 'amount_paid'
        },
        amount_unpaid: {
            type: DataTypes.INTEGER,
            field: 'amount_unpaid'
        },
    }, {
        sequelize,
        tableName: 'transaction',
        modelName: 'Transaction',
        timestamps: true
    })
    return Transaction
}