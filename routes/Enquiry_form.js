const express = require("express")
const router = express.Router()
const EnqueryFormControler = require('../controllers/Enquery_Form')
const verify = require("../middleware/JWT")
const imgUpload = require('../middleware/ImmgUpload')

router.post('/updateOrder', verify.validateToken, EnqueryFormControler.orderStatus)
router.post('/getOrder', verify.validateToken, EnqueryFormControler.getAllOrder)
router.post('/get', verify.validateToken, EnqueryFormControler.getEnqForm)
router.post('/post', verify.validateToken, EnqueryFormControler.addEnqForm)
router.post('/update', verify.validateToken, EnqueryFormControler.updateEnqForm)
router.post('/delete', verify.validateToken, EnqueryFormControler.deleteEnqForm)
router.post('/find_client', verify.validateToken, EnqueryFormControler.find_client)
router.post('/document', imgUpload.upload.single('document'), EnqueryFormControler.uploadeDocument)

module.exports = router