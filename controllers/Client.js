const { Client, Users } = require('../models')
const bcrypt = require("bcrypt")
const { createTokens } = require("../middleware/JWT")
// const ShortUniqueId = require('short-unique-id');
const generateUniqueId = require('generate-unique-id');
const { mailGenerator } = require('../service/nodemailer')

exports.createClient = async (req, res) => {
    try {
        const { client } = req.body
        const pass = client.password
        const find_client = await Client.findOne({
            where: {
                client_email: client.client_email
            }
        })
        if (find_client) {
            return res.status(400).json({ message: "Client already exists" })
        } else {
            bcrypt.hash(client.password, 10).then((hash) => {
                client.password = hash
                const id = generateUniqueId({
                    length: 6,
                    useLetters: false
                });
                client.client_id = id
                Client.create(client).then(async (createUser) => {
                    const accessToken = createTokens(createUser)
                    var mail_body = {
                        client_email: client.client_email,
                        password: pass,
                        client_id: id,
                        temp_id: createUser.id
                    }
                    await mailGenerator(mail_body).then(() => {
                        return res.status(200).json({
                            message: "Client register successful",
                            createUser,
                            accessToken
                        })
                    })
                }).catch((err) => {
                    if (err) {
                        res.status(400).json({ error: err })
                    }
                })
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

exports.clientLogin = async (req, res) => {
    try {
        const { login } = req.body
        const find_user = await Client.findOne({
            where: {
                client_email: login.client_email
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

exports.getClient = async (req, res) => {
    try {
        var getClient = await Client.findAndCountAll({
            where: {
                isDelete: false
            },
            order: [['createdAt', 'DESC']],
            limit: req.body.limit,
            offset: req.body.offset
        })

        if (!getClient) {
            return res.status(404).json({
                message: "Something went wrong"
            })
        } else {
            return res.status(200).json({
                message: "Success",
                getClient
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.updateClient = async (req, res) => {
    try {
        const { client } = req.body
        var update_client = await Client.update(
            client,
            {
                where: {
                    id: client.id
                }
            }
        )
        return res.status(200).send({
            message: "update post",
            update_client
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.deleteClient = async (req, res) => {
    try {
        const data = await Client.findAll({
            where: {
                id: req.body.id
            }
        })
        if (!data) {
            return res.status(404).json({
                message: "post not found"
            })
        } else {
            const update_form = await Client.update({
                isDelete: true
            },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            return res.status(200).send({
                message: "Client deleted successfully",
                update_form
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

