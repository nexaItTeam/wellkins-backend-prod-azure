const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model { }
    Comment.init({
        user_id: {
            type: DataTypes.INTEGER,
            field: 'user_id'
        },
        enq_id: {
            type: DataTypes.INTEGER,
            field: 'enq_id'
        },
        comment: {
            type: DataTypes.STRING,
            field: 'comment'
        },
        user_name: {
            type: DataTypes.STRING,
            field: 'user_name'
        }
    }, {
        sequelize,
        tableName: 'comment',
        modelName: 'Comment',
        timestamps: true
    })
    return Comment
}