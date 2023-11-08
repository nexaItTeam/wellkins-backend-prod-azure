const { Favourite } = require('../models')
const db = require('../models')
const model = require('../models')
const { azureEmailService, thankyouEmail } = require('../service/azureEmail')

exports.getAllFavourites = async (req, res) => {
    try {
        var getAllFavourites = await Favourite.findAndCountAll({
            where: {
                user_id: req.body.user_id
            },
            include: [
                {
                    model: model.Property,
                    as: 'prop_data'
                },
                {
                    model: model.Client,
                    as: 'user_data'
                }
            ]

        })
        if (!getAllFavourites) {
            return res.status(404).json({
                message: "Something went wrong"
            })
        } else {
            return res.status(200).json({
                message: "Success",
                getAllFavourites
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.addFavourites = async (req, res) => {
    try {
        const { favourite } = req.body
        var findFav = await db.sequelize.query(`SELECT * FROM nexa_capital.favourites where user_id=${favourite.user_id} and prop_id = ${favourite.prop_id};`)
        console.log(findFav)
        if (findFav[0].length == 0) {
            var create_enq = await Favourite.create(favourite)
            if (!create_enq) {
                return res.status(404).json({
                    message: "failed to create"
                })
            } else {
                return res.status(200).json({
                    message: "created",
                    create_enq
                })
            }
        } else {
            return res.status(200).json({
                message: "Property already exist in your Favourite List",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error",
            error
        })
    }

}


exports.deleteFavourite = async (req, res) => {
    try {
        const fav_id = req.body.id
        const data = await Favourite.findOne({ where: { id: fav_id } })
        if (!data) {
            return res.status(404).json({
                message: "Data not found"
            })
        } else {
            Favourite.destroy({
                where: {
                    id: fav_id
                }
            }).then((_) => {
                res.status(200).send({
                    message: "Delete",
                    // data
                })
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}
