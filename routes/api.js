const express = require("express")
const router = express.Router()
const user = require('./Users')
const property = require('./Property')
const blog = require('./Blogs')
const enquery = require('./Enquery')
const client = require('./Client')
const Enq_Form = require('./Enquiry_form')

router.use('/user', user)
router.use('/property', property)
router.use('/blog', blog)
router.use('/enquery', enquery)
router.use('/client', client)
router.use('/enq-form', Enq_Form)

module.exports = router