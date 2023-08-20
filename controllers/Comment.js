const { Comment } = require('../models')

exports.addComment = async (req, res) => {
    try {
        const { comment } = req.body
        var add_comment = await Comment.crearte(comment)
        if (!add_comment) {
            return res.status(404).json({
                message: "failed to comment"
            })
        } else {
            return res.status(200).json({
                message: "created",
                add_comment
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}