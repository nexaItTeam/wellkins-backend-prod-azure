const express = require("express")
const router = express.Router()
const votingControler = require('../controllers/voting')
const verify = require("../middleware/JWT")

router.post('/getAllVotingList', verify.validateToken, votingControler.getAllVotingList)
router.post('/addVote', verify.validateToken, votingControler.addVote)
/* router.post('/update', verify.validateToken, propertyControler.updateEnq)
router.post('/delete', verify.validateToken, favouriteControler.deleteFavourite) */
 

module.exports = router