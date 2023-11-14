const { Voting } = require('../models')
const { Property } = require('../models')
const db = require('../models')
const model = require('../models')
const { azureEmailService, thankyouEmail } = require('../service/azureEmail')

exports.getAllVotingList = async (req, res) => {
    try {

        var getAllVotingList = await Voting.findAndCountAll({
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
        
        if (!getAllVotingList) {
            return res.status(404).json({
                message: "Something went wrong"
            })
        } else {
            return res.status(200).json({
                message: "Success",
                getAllVotingList
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
exports.addVote = async (req, res) => {
    try {
        const { vote } = req.body
        var findVote = await db.sequelize.query(`SELECT * FROM nexa_capital.voting where user_id=${vote.user_id} and prop_id = ${vote.prop_id};`)
        
        if (findVote[0].length == 0) {
            var prop_vote = await Voting.create(vote)
            if (!prop_vote) {
                return res.status(404).json({
                    message: "failed to create"
                })
            } else {
                var voteCount = await Property.findAndCountAll({
                    where: {
                       id: vote.prop_id
                    },
                })
                console.log(voteCount)
                var incrementCount = await Property.update({ prop_vote_count: voteCount.rows[0].prop_vote_count + 1 }, {
                    where: {
                        id: vote.prop_id
                    }
                  }) 
                 //console.log(voteCount.rows[0].Property.prop_vote_count)
                return res.status(200).json({
                    message: "created",
                    prop_vote,
                   
                })

            }
        } else {
            return res.status(200).json({
                message: "Already Voted For these Property",
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