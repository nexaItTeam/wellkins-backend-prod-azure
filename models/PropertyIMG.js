const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PropertyIMG extends Model { }

    PropertyIMG.init({
        prop_id: {
            type: DataTypes.INTEGER,
            field: 'prop_id'
        },
        property_img: {
            type: DataTypes.STRING,
            field: 'property_img'
        },
        img_type: {
            type: DataTypes.STRING,
            field: 'img_type'
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            field: 'isDelete',
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: 'property_img',
        modelName: 'PropertyIMG',
        timestamps: true
    })
    return PropertyIMG
}