const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Bloges extends Model { }
    Bloges.init({
        blog_title: {
            type: DataTypes.STRING,
            field: 'blog_title'
        },
        blog_desc: {
            type: DataTypes.STRING,
            field: 'blog_desc'
        },
        blog_body: {
            type: DataTypes.STRING,
            field: 'blog_body'
        },
        isApprove: {
            type: DataTypes.STRING,
            field: 'isApprove',
            defaultValue: false
        },
        URL: {
            type: DataTypes.STRING,
            field: 'URL',
        },
        comment: {
            type: DataTypes.STRING,
            field: "comment"
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            field: 'isDelete',
            defaultValue: false,
        },
        isDraft:{
            type: DataTypes.BOOLEAN,
            field: 'isDraft',
            defaultValue: false,
        },
        like: {
            type: DataTypes.STRING,
            field: "like"
        }
    }, {
        sequelize,
        tableName: 'bloges',
        modelName: 'Bloges',
        timestamps: true
    })
    return Bloges
}