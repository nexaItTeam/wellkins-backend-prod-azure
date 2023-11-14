const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Voting extends Model {
        static associate(models) {
            Voting.belongsTo(models.Property, {
                foreignKey: "prop_id",
                as: 'prop_data'
            })

            Voting.belongsTo(models.Client, {
                foreignKey: "user_id",
                as:"user_data"
            })
        }
    }

    Voting.init({
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
        tableName: 'voting',
        modelName: 'Voting',
        timestamps: false
    })
    return Voting
}