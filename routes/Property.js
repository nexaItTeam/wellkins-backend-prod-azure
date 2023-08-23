const express = require("express")
const router = express.Router()
const propertyControler = require('../controllers/Property')
const verify = require("../middleware/JWT")
const property_img = require('../middleware/PropertyIMG')
const imgUpload = require('../middleware/ImmgUpload')


router.post('/getAll', propertyControler.getAllProperty)
router.post('/add', verify.validateToken, propertyControler.addProperty)
router.post('/update', verify.validateToken, propertyControler.updateProperty)
router.post('/delete', verify.validateToken, propertyControler.deleteProperty)
// router.post('/upload/:id',
//     verify.validateToken,
//     property_img.upload.array('property'),
//     propertyControler.uploadImg
// )
router.post('/getImg', propertyControler.getPropertyImg)
router.post('/getImgById', propertyControler.getPropertyImgById)
router.post('/deleteimg', verify.validateToken, propertyControler.deleteImg)
router.post('/upload/property/:id', verify.validateToken, imgUpload.upload.single('property'), propertyControler.addPropImg)
router.post('/upload/brochure/:id', verify.validateToken, imgUpload.upload.single('brochure'), propertyControler.uploadeBrochure)

module.exports = router