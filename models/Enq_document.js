const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Enq_document extends Model { }
    Enq_document.init({
        client_id: {
            type: DataTypes.INTEGER,
            field: 'client_id'
        },
        docs_name: {
            type: DataTypes.STRING,
            field: 'docs_name'
        },
        docs_img: {
            type: DataTypes.STRING,
            field: 'docs_name'
        }
    }, {
        sequelize,
        tableName: 'enq_document',
        modelName: 'Enq_document',
        timestamps: true
    })
    return Enq_document
}