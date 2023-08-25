const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Document extends Model { }

    Document.init({
        client_id: {
            type: DataTypes.INTEGER,
            field: 'client_id'
        },
        docs_type: {
            type: DataTypes.STRING,
            field: 'docs_type'
        },
        docs_img: {
            type: DataTypes.STRING,
            field: 'docs_img'
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            field: 'isDelete',
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: 'document',
        modelName: 'Document',
        timestamps: true
    })
    return Document
}