const { Users } = require('../models')
const bcrypt = require("bcrypt")
const { createTokens, validateToken } = require("../middleware/JWT")

exports.registerUser = async (req, res) => {
    try {
        const { user } = req.body
        const find_user = await Users.findOne({
            where: {
                user_email: user.user_email
            }
        })
        if (find_user) {
            return res.status(400).json({ message: "User already exists" })
        } else {
            bcrypt.hash(user.password, 10).then((hash) => {
                user.password = hash
                Users.create(user).then((createUser) => {
                    const accessToken = createTokens(createUser)
                    return res.status(200).json({
                        message: "User register successful",
                        createUser,
                        accessToken
                    })
                })
                    .catch((err) => {
                        if (err) {
                            res.status(400).json({ error: err })
                        }
                    })
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { login } = req.body
        const find_user = await Users.findOne({
            where: {
                user_email: login.user_email
            }
        })
        if (!find_user) {
            return res.status(400).json({ message: "User not found" })
        } else {
            const dbPassword = find_user.password
            bcrypt.compare(login.password, dbPassword).then((match) => {
                if (!match) {
                    res.status(400).json({
                        error: "Wrong Credential!"
                    })
                } else {
                    const accessToken = createTokens(login)
                    if (accessToken) {
                        return res.status(200).json({
                            message: "User login successful",
                            user: find_user,
                            accessToken
                        })
                    }
                }
            })
        }
    } catch (error) {
        console.log("error", error)
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.getAllUser = async (req, res) => {
    try {
        var getUser = await Users.findAndCountAll({
            where: {
                isDelete: false
            },
            order: [['createdAt', 'DESC']],
            limit: req.body.limit,
            offset: req.body.offset
        })
        if (!getUser) {
            return res.status(404).json({
                message: "Data not found"
            })
        } else {
            return res.status(200).json({
                message: "Success",
                getUser
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { user } = req.body
        var uppdate_user = await Users.update(
            user,
            {
                where: {
                    id: user.id
                }
            }
        )
        return res.status(200).send({
            message: "update User",
            uppdate_user
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

