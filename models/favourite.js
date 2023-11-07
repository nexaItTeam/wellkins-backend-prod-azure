const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Favourite extends Model {
        static associate(models) {
            Favourite.belongsTo(models.Property, {
                foreignKey: "prop_id",
                as: 'prop_data'
            })

            Favourite.belongsTo(models.Client, {
                foreignKey: "user_id",
                as:"user_data"
            })
        }
    }

    Favourite.init({
        user_id: {
            type: DataTypes.INTEGER,
            field: 'user_id'
        },
        prop_id: {
            type: DataTypes.INTEGER,
            field: 'prop_id'
        },
        
    }, {
        sequelize,
        tableName: 'favourites',
        modelName: 'Favourite',
        timestamps: true
    })
    return Favourite
}