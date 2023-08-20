const express = require("express")
const router = express.Router()
const BlogControler = require('../controllers/Blogs')
const verify = require("../middleware/JWT")

router.post('/getAll', BlogControler.getAllBlogs)
router.post('/add', verify.validateToken, BlogControler.addBlog)
router.post('/update', verify.validateToken, BlogControler.updateBlog)
router.post('/delete', verify.validateToken, BlogControler.deleteBlog)

module.exports = router