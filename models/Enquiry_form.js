const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Enquiry_form extends Model { }
    Enquiry_form.init({
        client_id: {
            type: DataTypes.INTEGER,
            field: 'client_id'
        },
        prop_id: {
            type: DataTypes.INTEGER,
            field: 'prop_id'
        },
        form_a: {
            type: DataTypes.JSON,
            field: 'form_a'
        },
        form_b: {
            type: DataTypes.JSON,
            field: 'form_b'
        },
        form_c: {
            type: DataTypes.JSON,
            field: 'form_c'
        },
        form_d: {
            type: DataTypes.JSON,
            field: 'form_d'
        },
        form_e: {
            type: DataTypes.JSON,
            field: 'form_e'
        },
        form_f: {
            type: DataTypes.JSON,
            field: 'form_f'
        },
        form_g: {
            type: DataTypes.JSON,
            field: 'form_g'
        },
        form_h: {
            type: DataTypes.JSON,
            field: 'form_h'
        },
        investor_form_type: {
            type: DataTypes.STRING,
            field: 'investor_form_type'
        },
        isDraft: {
            type: DataTypes.BOOLEAN,
            field: 'isDraft',
            defaultValue: false,
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            field: 'isDelete',
            defaultValue: false,
        }
    }, {
        sequelize,
        tableName: 'enquiry_form',
        modelName: 'Enquiry_form',
        timestamps: true
    })
    return Enquiry_form
}