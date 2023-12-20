const { Client, Users, Password_reset } = require('../models')
const bcrypt = require("bcrypt")
const { createTokens } = require("../middleware/JWT")
// const ShortUniqueId = require('short-unique-id');
const generateUniqueId = require('generate-unique-id');
const { mailGenerator } = require('../service/nodemailer')
const { azureEmailService, forgotPassword, accountCreate, multipleAccount } = require('../service/azureEmail')

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
                        client_name: client.full_name,
                        client_email: client.client_email,
                        password: pass,
                        client_id: id,
                        temp_id: createUser.id
                    }
                    await accountCreate(mail_body).then(() => {
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

// test test test 

exports.createClients = async (req, res) => {
    try {
        const { clients } = req.body

        const emails = []
        await clients.forEach(data => {
            emails.push(data)
        });

        const find_client = await Client.findAll()
        for (let i = 0; i < find_client.length; i++) {
            var index = emails.findIndex(x => x.client_email == find_client[i].client_email)
            if (index != -1) {
                emails.splice(index, 1)
            }
        }
        //  console.log(emails)
        var payload = []
       
        for await (let email of emails) {
            console.log("2", email)
            const id = generateUniqueId({
                length: 6,
                useLetters: false
            });
           await bcrypt.hash(email.password, 10).then((hash) => {
                var temp = {
                    full_name: email.full_name,
                    password: hash,
                    client_email: email.client_email,
                    contact_no: email.contact_no,
                    client_id: id,
                }
                payload.push(temp)
            })
        }

        await Client.bulkCreate(payload).then(async (resp) => {
             await multipleAccount(emails).then(() => {
                console.log(resp)
                 return res.status(200).json({
                    message: "Success",
                    resp
                })
             })
        }).catch((err) => {
            console.log(err)
             return res.status(400).json({
                 message: "Success",
                 err
             })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server Error",
        })
    }
}

const findEmail = async (array1, array2) => {
    const set1 = new Set(array1);
    const set2 = new Set(array2);

    const uniqueSet = new Set();

    for (const obj of set1) {
        if (!set2.has(obj)) {
            uniqueSet.add(obj);
        }
    }

    for (const obj of set2) {
        if (!set1.has(obj)) {
            uniqueSet.add(obj);
        }
    }

    const uniqueArray = Array.from(uniqueSet);

    return uniqueArray;
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
        console.log(req.body.id)
       if(req.body.id == null){
        var getClient = await Client.findAndCountAll({
            where: {
                isDelete: false,
                active: req.body.active
            },
            order: [['createdAt', 'DESC']],
            limit: req.body.limit,
            offset: req.body.offset
        })
    }else{
        var getClient = await Client.findOne({
            where: {
                id: req.body.id,
                client_email:req.body.client_email
            }
        })
    }
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
        console.log(error)
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

exports.sendEmail = async (req, res) => {
    try {
        // var mail_body = {
        //     user_email: req.body.user_email,
        //     Password: "",
        //     ClientID: "",
        //     temp_id: ""
        // }
        await azureEmailService(req.body).then(() => {
            return res.status(200).json({
                message: "mail send successfully",
            })
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.sendOtp = async (req, res) => {
    try {
        const find_user = await Client.findOne({
            where: {
                client_email: req.body.email
            }
        })
        if (!find_user) {
            return res.status(400).json({ message: "Email not found" })
        } else {
            const otp = generateUniqueId({
                length: 6,
                useLetters: false
            });
            bcrypt.hash(otp, 10).then(async (hash) => {
                var temp_1 = {
                    "otp": hash,
                    "email": req.body.email,
                    "createdAt": Date.now(),
                    "expireAt": Date.now() + 600000
                }
                const reset_pass = await Password_reset.create(temp_1)
                if (reset_pass) {
                    var temp = {
                        "otp": otp,
                        "email": req.body.email,
                    }
                    forgotPassword(temp).then(() => {
                        res.status(200).json({
                            message: "OTP sent on your email",
                            id: reset_pass.id
                        })
                    }).catch((error) => {
                        res.status(400).json({
                            message: "OTP not able sent"
                        })
                    })
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const find_otp = await Password_reset.findOne({
            where: {
                id: req.body.id
            }
        })
        if (!find_otp) {
            return res.status(400).json({ message: "invalid otp not found" })
        } else {
            const time = new Date()
            const otp = req.body.otp
            if (find_otp.expireAt <= time) {
                return res.status(200).json({ message: "OTP is Expired", isExpired: find_otp.expireAt <= time })
            } else {
                bcrypt.compare(otp, find_otp.otp).then((match) => {
                    if (!match) {
                        return res.status(200).json({ message: "OTP is not match" })
                    } else {
                        return res.status(200).json({ message: "OTP is Verified", isExpired: find_otp.expireAt <= time })
                    }
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { client } = req.body
        const find_client = await Client.findOne({
            where: {
                client_email: client.email
            }
        })
        if (find_client) {
            bcrypt.hash(client.password, 10).then(async (hash) => {
                client.password = hash
                var update_client = await Client.update(
                    client,
                    {
                        where: {
                            id: find_client.id
                        }
                    }
                )
                return res.status(200).send({
                    message: "update password",
                    update_client
                })
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { client } = req.body
        const find_client = await Client.findOne({
            where: {
                client_email: client.email
            }
        })
        const dbPassword = find_client.password
        await bcrypt.compare(client.old_password, dbPassword).then(async (match) => {
            if (!match) {
                return res.status(200).json({
                    error: "Wrong Credential!"
                })
            } else {
                await bcrypt.hash(client.new_password, 10).then(async (hash) => {
                    var temp = {
                        "id": find_client.id,
                        "password": hash,
                        "isFirst": false
                    }
                    await Client.update(temp, {
                        where: {
                            id: temp.id
                        }
                    }).then(() => {
                        return res.status(200).json({
                            error: "password change successfully"
                        })
                    })
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error
        })
    }
}
