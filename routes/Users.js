const express = require("express")
const router = express.Router()
const userControler = require('../controllers/Users')
const verify = require("../middleware/JWT")

router.post('/register', userControler.registerUser)
router.post('/login', userControler.login)
router.post('/getAllUser', verify.validateToken, userControler.getAllUser)
router.post('/updateUser', verify.validateToken, userControler.updateUser)

module.exports = router