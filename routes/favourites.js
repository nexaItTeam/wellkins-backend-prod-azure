const express = require("express")
const router = express.Router()
const favouriteControler = require('../controllers/favourite')
const verify = require("../middleware/JWT")

router.post('/getAllFavouriteList', verify.validateToken, favouriteControler.getAllFavourites)
router.post('/addFavorite', verify.validateToken, favouriteControler.addFavourites)
//router.post('/update', verify.validateToken, propertyControler.updateEnq)
router.post('/delete', verify.validateToken, favouriteControler.deleteFavourite)


module.exports = router