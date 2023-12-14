const { Enquiry_form, Client, Document, Order, Transaction } = require('../models')
const model = require('../models')
const { documents } = require('../middleware/Document')
const imgUpload = require('../middleware/ImmgUpload')
const { azureUpload } = require('../service/azure')
const generateUniqueId = require('generate-unique-id');
const db = require('../models');
const { invoice_Mail } = require('../service/azureEmail')
const bcrypt = require("bcrypt")
const { multipleAccount } = require('../service/azureEmail')

// get all form
exports.getAllOrder = async (req, res) => {
    try {
        var getOrder
        if (req.body.client_id != null && req.body.prop_id == null) {
            getOrder = await Order.findAndCountAll({
                where: {
                    client_id: req.body.client_id
                },
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: model.Property,
                        as: 'enq_prop_data'
                    },
                    {
                        model: model.Client,
                        as: 'enq_client_data'
                    },
                    {
                        model: model.Enquiry_form,
                        as: 'enq_form_data'
                    }
                ]
            })
        } else if (req.body.client_id != null && req.body.prop_id != null) {
            getOrder = await Order.findAndCountAll({
                where: {
                    client_id: req.body.client_id,
                    prop_id: req.body.prop_id,
                },
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: model.Property,
                        as: 'enq_prop_data'
                    },
                    {
                        model: model.Client,
                        as: 'enq_client_data'
                    },
                    {
                        model: model.Enquiry_form,
                        as: 'enq_form_data'
                    }
                ]
            })
        } else {
            getOrder = await Order.findAndCountAll({
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: model.Property,
                        as: 'enq_prop_data'
                    },
                    {
                        model: model.Client,
                        as: 'enq_client_data'
                    },
                    {
                        model: model.Enquiry_form,
                        as: 'enq_form_data'
                    }
                ]
            })
        }
        if (!getOrder) {
            return res.status(400).json({
                message: "Something went wrong"
            })
        } else {
            return res.status(200).json({
                message: "Success",
                getOrder
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

// find enq form
exports.getEnqForm = async (req, res) => {
    try {
        var get_Enq_Form = await Enquiry_form.findAll({
            where: {
                isDelete: false,
                client_id: req.body.client_id,
                investor_form_type: req.body.investor_form_type,
            }
        })
        if (!get_Enq_Form) {
            return res.status(200).json({
                message: "Data not found"
            })
        } else {
            get_Enq_Form = get_Enq_Form[get_Enq_Form.length - 1]
            var enq_form = [get_Enq_Form]
            return res.status(200).json({
                message: "Success",
                enq_form
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.find_client = async (req, res) => {
    try {
        const find_form = await Enquiry_form.findOne({
            where: {
                client_id: req.body.client_id
            }
        })
        if (find_form) {
            return res.status(400).json({ message: "User not allow to fill form again", "isAllow": false })
        } else {
            return res.status(200).json({ message: "User allow to fill form", "isAllow": true })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

// order api
exports.addEnqForm = async (req, res) => {
    try {
        const { enq_form } = req.body

        // find user in client table
        const find_user = await Client.findOne({
            where: {
                id: enq_form.client_id
            }
        })
        if (!find_user) {
            return res.status(400).json({ message: "User not found" })
        } else {
            await Enquiry_form.create(enq_form).then(async (enq_resp) => {
                if (enq_form.isDraft != true) {
                    // create clients
                    if (enq_form.investor_form_type === "Individual" && req.body.enq_form.clients.length != 0) {

                        const emails = []
                        await enq_form.clients.forEach(data => {
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
                            await multipleAccount(emails).then(async () => {
                                let order_payload = []
                                resp.forEach(data => {
                                    const order_id = generateUniqueId({
                                        length: 8,
                                        useLetters: false
                                    })
                                    var temp = {
                                        investment_unit: enq_form.investment_unit,
                                        client_id: data.id,
                                        order_id: enq_form.prop_id + order_id,
                                        holder_type: "joint",
                                        enq_form_id: enq_form.id || enq_resp.id,
                                        prop_id: enq_form.prop_id,
                                        paidStatus: enq_form.paidStatus,
                                        investing_amount: enq_form.investing_amount,
                                        paidStatus: enq_form.paidStatus
                                    }
                                    order_payload.push(temp)
                                })
                                const order_id = generateUniqueId({
                                    length: 8,
                                    useLetters: false
                                })
                                const main_holder = {
                                    investment_unit: enq_form.investment_unit,
                                    client_id: enq_form.client_id,
                                    holder_type: "self",
                                    order_id: enq_form.prop_id + order_id,
                                    enq_form_id: enq_form.id || enq_resp.id,
                                    prop_id: enq_form.prop_id,
                                    paidStatus: enq_form.paidStatus,
                                    investing_amount: enq_form.investing_amount,
                                    paidStatus: enq_form.paidStatus
                                }
                                order_payload.push(main_holder)
                                if (order_payload.length == 1) {
                                    var existing_email = []
                                    enq_form.clients.forEach((data) => {
                                        existing_email.push(data.client_email)
                                    })
                                    // if every client is existing
                                    const find_client = await Client.findAll({
                                        where: {
                                            client_email: existing_email
                                        }
                                    })
                                    for await (let client of find_client) {
                                        // console.log(client.id)
                                        const joint_holder = {
                                            investment_unit: enq_form.investment_unit,
                                            client_id: client.id,
                                            holder_type: "joint",
                                            order_id: enq_form.prop_id + order_id,
                                            enq_form_id: enq_form.id || enq_resp.id,
                                            prop_id: enq_form.prop_id,
                                            paidStatus: enq_form.paidStatus,
                                            investing_amount: enq_form.investing_amount,
                                            paidStatus: enq_form.paidStatus
                                        }
                                        order_payload.push(joint_holder)
                                    }
                                }
                                // order create
                                await Order.bulkCreate(order_payload).then(async (resp) => {
                                    console.log(resp)
                                    // create transaction
                                    var transaction = []
                                    resp.forEach((data) => {
                                        var temp = {
                                            "client_id": data.client_id,
                                            "order_id": data.id,
                                            "enq_form_id": data.enq_form_id,
                                            "prop_id": data.prop_id,
                                            "investing_amount": data.investing_amount,
                                            "investment_unit": data.investment_unit,
                                            "units_acquired": data.investment_unit,
                                            "units_transferred": 0,
                                            "units_balance": data.investment_unit,
                                            "transaction_status": enq_form.transaction_status
                                        }
                                        transaction.push(temp)
                                    })
                                    console.log(transaction)
                                    await Transaction.bulkCreate(transaction).then(() => {
                                        return res.status(200).json({
                                            message: "order place successfully",
                                            resp
                                        })
                                    })
                                }).catch((err) => {
                                    console.log(err)
                                    return res.status(400).json({
                                        message: "failed to create order"
                                    })
                                })
                            })
                        }).catch((err) => {
                            return res.status(400).json({
                                message: "error",
                                err
                            })
                        })
                    } else {
                        // already client exist
                        const order_id = generateUniqueId({
                            length: 8,
                            useLetters: false
                        })
                        var temp = {
                            investment_unit: enq_form.investment_unit,
                            client_id: enq_form.client_id,
                            order_id: enq_form.prop_id + order_id,
                            enq_form_id: enq_form.id || enq_resp.id,
                            prop_id: enq_form.prop_id,
                            paidStatus: enq_form.paidStatus,
                            investing_amount: enq_form.investing_amount,
                            paidStatus: enq_form.paidStatus
                        }
                        await Order.create(temp).then(async (resp) => {
                            var temp = {
                                "client_id": resp.client_id,
                                "order_id": resp.id,
                                "enq_form_id": resp.enq_form_id,
                                "prop_id": resp.prop_id,
                                "investing_amount": resp.investing_amount,
                                "investment_unit": resp.investment_unit,
                                "units_acquired": resp.investment_unit,
                                "units_transferred": 0,
                                "units_balance": resp.investment_unit,
                                "transaction_status": enq_form.transaction_status
                            }
                            await Transaction.create(temp).then(() => {
                                return res.status(200).json({
                                    message: "order place successfully",
                                    resp
                                })
                            })
                        }).catch((err) => {
                            console.log(err)
                            return res.status(400).json({
                                message: "failed to create order"
                            })
                        })
                    }
                } else {
                    return res.status(200).json({
                        message: "save draft"
                    })
                }
            }).catch((err) => {
                console.log(err)
                return res.status(400).json({
                    message: "failed to create enquery form"
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

exports.invoiceEmail = async (req, res) => {
    try {
        var { email } = req.body
        console.log(email.id)
        await invoice_Mail(email).then(async () => {
            const updat_order = await Order.update(
                {
                    isEamil: true
                },
                {
                    where: {
                        id: email.id
                    }
                }
            )
            if (updat_order) {
                return res.status(200).json({
                    message: "email send successfully",
                    updat_order
                })
            }
        }).catch((e) => {
            console.log(e)
            return res.status(400).json({
                message: e
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: "server error"
        })
    }
}
// get order
const getOrder = async (id) => {
    try {
        var get_order = await Order.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: model.Property,
                    as: 'enq_prop_data'
                },
                {
                    model: model.Client,
                    as: 'enq_client_data'
                },
                {
                    model: model.Enquiry_form,
                    as: 'enq_form_data'
                }
            ]
        })
        return get_order
    } catch (error) {
        return error
    }
}

exports.updateEnqForm = async (req, res) => {
    try {
        const { enq_form } = req.body
        var update_form = await Enquiry_form.update(
            enq_form,
            {
                where: {
                    client_id: enq_form.client_id,
                    id: enq_form.id,
                    investor_form_type: enq_form.investor_form_type
                }
            }
        )
        if (enq_form.isDraft != true) {
            if (enq_form.investor_form_type === "Individual") {
                console.log("2")
                const emails = []
                await enq_form.clients.forEach(data => {
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
                    await multipleAccount(emails).then(async () => {
                        let order_payload = []
                        resp.forEach(data => {
                            const order_id = generateUniqueId({
                                length: 8,
                                useLetters: false
                            })
                            var temp = {
                                investment_unit: enq_form.investment_unit,
                                client_id: data.id,
                                order_id: enq_form.prop_id + order_id,
                                holder_type: "joint",
                                enq_form_id: enq_form.id || enq_resp.id,
                                prop_id: enq_form.prop_id,
                                paidStatus: enq_form.paidStatus,
                                investing_amount: enq_form.investing_amount,
                                paidStatus: enq_form.paidStatus
                            }
                            order_payload.push(temp)
                        })
                        const order_id = generateUniqueId({
                            length: 8,
                            useLetters: false
                        })
                        const main_holder = {
                            investment_unit: enq_form.investment_unit,
                            client_id: enq_form.client_id,
                            holder_type: "self",
                            order_id: enq_form.prop_id + order_id,
                            enq_form_id: enq_form.id || enq_resp.id,
                            prop_id: enq_form.prop_id,
                            paidStatus: enq_form.paidStatus,
                            investing_amount: enq_form.investing_amount,
                            paidStatus: enq_form.paidStatus
                        }
                        order_payload.push(main_holder)

                        if (order_payload.length == 1) {

                            var existing_email = []
                            enq_form.clients.forEach((data) => {
                                existing_email.push(data.client_email)
                            })
                            // if every client is existing
                            const find_client = await Client.findAll({
                                where: {
                                    client_email: existing_email
                                }
                            })
                            for await (let client of find_client) {
                                // console.log(client.id)
                                const joint_holder = {
                                    investment_unit: enq_form.investment_unit,
                                    client_id: client.id,
                                    holder_type: "joint",
                                    order_id: enq_form.prop_id + order_id,
                                    enq_form_id: enq_form.id || enq_resp.id,
                                    prop_id: enq_form.prop_id,
                                    paidStatus: enq_form.paidStatus,
                                    investing_amount: enq_form.investing_amount,
                                    paidStatus: enq_form.paidStatus
                                }
                                order_payload.push(joint_holder)
                            }
                        }
                        // order create
                        await Order.bulkCreate(order_payload).then(async (resp) => {
                            console.log("4", resp)
                            // create transaction
                            var transaction = []
                            resp.forEach((data) => {
                                var temp = {
                                    "client_id": data.client_id,
                                    "order_id": data.id,
                                    "enq_form_id": data.enq_form_id,
                                    "prop_id": data.prop_id,
                                    "investing_amount": data.investing_amount,
                                    "investment_unit": data.investment_unit,
                                    "units_acquired": data.investment_unit,
                                    "units_transferred": 0,
                                    "units_balance": data.investment_unit,
                                    "transaction_status": enq_form.transaction_status
                                }
                                transaction.push(temp)
                            })
                            console.log(transaction)
                            await Transaction.bulkCreate(transaction).then(() => {
                                return res.status(200).json({
                                    message: "order place successfully",
                                    resp
                                })
                            })
                        }).catch((err) => {
                            console.log("===", err)
                            return res.status(400).json({
                                message: "failed to create order"
                            })
                        })
                    })
                }).catch((err) => {
                    console.log(err)
                    return res.status(400).json({
                        message: "error",
                        err
                    })
                })
            } else {
                const order_id = generateUniqueId({
                    length: 8,
                    useLetters: false
                })
                var temp = {
                    investment_unit: enq_form.investment_unit,
                    client_id: enq_form.client_id,
                    order_id: enq_form.prop_id + order_id,
                    enq_form_id: enq_form.id || enq_resp.id,
                    prop_id: enq_form.prop_id,
                    paidStatus: enq_form.paidStatus,
                    investing_amount: enq_form.investing_amount,
                    paidStatus: enq_form.paidStatus
                }
                await Order.create(temp).then(async (resp) => {
                    var temp = {
                        "client_id": resp.client_id,
                        "order_id": resp.id,
                        "enq_form_id": resp.enq_form_id,
                        "prop_id": resp.prop_id,
                        "investing_amount": resp.investing_amount,
                        "investment_unit": resp.investment_unit,
                        "units_acquired": resp.investment_unit,
                        "units_transferred": 0,
                        "units_balance": resp.investment_unit,
                        "transaction_status": enq_form.transaction_status
                    }
                    await Transaction.create(temp).then(() => {
                        return res.status(200).json({
                            message: "order place successfully",
                            resp
                        })
                    })
                }).catch((err) => {
                    console.log(err)
                    return res.status(400).json({
                        message: "failed to create order"
                    })
                })
            }
        } else {
            return res.status(200).json({
                message: "save draft",
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

exports.deleteEnqForm = async (req, res) => {
    try {
        const data = await Enquiry_form.findAll({
            where: {
                id: req.body.id
            }
        })
        if (!data) {
            return res.status(404).json({
                message: "post not found"
            })
        } else {
            const update_form = await Enquiry_form.update({
                isDelete: true
            },
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            return res.status(200).send({
                message: "update post",
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

exports.uploadeDocument = async (req, res) => {
    try {
        const id = parseInt(req.body.id)
        const docs_type = req.body.docs_type
        const file = req.file
        console.log("file", file, id, docs_type)
        await azureUpload(file).then(async (_) => {
            var temp = {
                "client_id": id,
                "docs_type": docs_type,
                "docs_img": `document/${file.originalname}`
            }
            var upload_img = await Document.create(temp)
            res.status(200).json({
                message: "Success upload",
                upload_img
            })
        }).catch((error) => {
            console.log(error)
            return res.status(400).json({
                message: "failed to upload"
            })
        })
    } catch (error) {

    }
}
// update order status
exports.orderStatus = async (req, res) => {
    try {
        const { order, transaction } = req.body
        var update_order = await Order.update(
            order,
            {
                where: {
                    id: order.id
                }
            })
        var traansaction = await Transaction.create(transaction)
        return res.status(200).json({
            message: "order update successfully",
            update_order, traansaction
        })
    } catch (error) {
        return res.status(500).json({
            message: "server data",
            error
        })
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const { order, transaction } = req.body
        if (order) {
            console.log("order")
            var updateStatus = await Order.update(order, {
                where: {
                    order_id: order.order_id
                }
            })
        }

        if (transaction) {
            console.log("transaction")
            var traansaction = await Transaction.create(transaction)
        }

        return res.status(200).json({
            message: "order update successfully",
            updateStatus, traansaction
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.investedLocations = async (req, res) => {
    try {
        var VIC = await db.sequelize.query(`select count(property.state) as count from property inner join nexa_capital.order on nexa_capital.order.prop_id = nexa_capital.property.id where state ='VIC'; `)
        var NSW = await db.sequelize.query(`select count(property.state) as count from property inner join nexa_capital.order on nexa_capital.order.prop_id = nexa_capital.property.id where state ='NSW'; `)
        var QLD = await db.sequelize.query(`select count(property.state) as count from property inner join nexa_capital.order on nexa_capital.order.prop_id = nexa_capital.property.id where state ='OLD'; `)
        var SA = await db.sequelize.query(`select count(property.state) as count from property inner join nexa_capital.order on nexa_capital.order.prop_id = nexa_capital.property.id where state ='SA'; `)
        var TAS = await db.sequelize.query(`select count(property.state) as count from property inner join nexa_capital.order on nexa_capital.order.prop_id = nexa_capital.property.id where state ='TAS'; `)
        var WA = await db.sequelize.query(`select count(property.state) as count from property inner join nexa_capital.order on nexa_capital.order.prop_id = nexa_capital.property.id where state ='WA'; `)
        var ACT = await db.sequelize.query(`select count(property.state) as count from property inner join nexa_capital.order on nexa_capital.order.prop_id = nexa_capital.property.id where state ='ACT'; `)
        var NT = await db.sequelize.query(`select count(property.state) as count from property inner join nexa_capital.order on nexa_capital.order.prop_id = nexa_capital.property.id where state ='NT'; `)

        var data = [
            {
                "VIC": VIC[0][0]['count']
            },
            {
                "NSW": NSW[0][0]['count']
            },
            {
                "QLD": QLD[0][0]['count']
            },
            {
                "SA": SA[0][0]['count']
            },
            {
                "TAS": TAS[0][0]['count']
            },
            {
                "WA": WA[0][0]['count']
            },
            {
                "ACT": ACT[0][0]['count']
            },
            {
                "NT": NT[0][0]['count']
            },
        ]
        return res.status(200).send({
            data
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }

}

exports.createunitcertificate = async (req, res) => {
    try {
        var get_order = await Order.findAll({
            where: {
                prop_id: req.body.prop_id,
                client_id: req.body.client_id
            },
            include: [
                {
                    model: model.Property,
                    as: 'enq_prop_data'
                },
                {
                    model: model.Client,
                    as: 'enq_client_data'
                },
                {
                    model: model.Enquiry_form,
                    as: 'enq_form_data'
                }
            ]
        })
        return res.status(200).json({
            message: "Success",
            get_order
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.getTransaction = async (req, res) => {
    try {
        console.log("req.body.client_id", req.body.client_id)
        var get_transaction
        if (req.body.client_id != null && req.body.client_id === null) {
            console.log('1')
            get_transaction = await Transaction.findAll({
                where: {
                    client_id: req.body.client_id
                },
                include: [
                    {
                        model: model.Client,
                        as: 'client_data'
                    },
                    {
                        model: model.Order,
                        as: 'order_data'
                    },
                    {
                        model: model.Enquiry_form,
                        as: 'enq_form_data'
                    },
                    {
                        model: model.Property,
                        as: 'prop_data'
                    }
                ],
                order: [['createdAt', 'DESC']],
            })
        } else if (req.body.order_id != null && req.body.form_type != "Individual") {
            console.log('2')
            get_transaction = await db.sequelize.query(`SELECT nexa_capital.transaction.*, nexa_capital.client.full_name, nexa_capital.order.order_id, 
                                                                nexa_capital.property.property_name
                                                                FROM nexa_capital.transaction
                                                                JOIN nexa_capital.client ON transaction.client_id = nexa_capital.client.id
                                                                JOIN nexa_capital.order ON transaction.order_id = nexa_capital.order.id
                                                                JOIN nexa_capital.property ON transaction.prop_id = nexa_capital.property.id
                                                                WHERE nexa_capital.order.order_id =${req.body.order_id} and 
                                                                nexa_capital.order.holder_type="self" ORDER BY nexa_capital.transaction.createdAt DESC;`)
        } else if (req.body.form_type === "Individual") {
            get_transaction = await db.sequelize.query(`SELECT nexa_capital.transaction.*, nexa_capital.client.full_name, nexa_capital.order.order_id, 
                                                                nexa_capital.property.property_name
                                                                FROM nexa_capital.transaction
                                                                JOIN nexa_capital.client ON transaction.client_id = nexa_capital.client.id
                                                                JOIN nexa_capital.order ON transaction.order_id = nexa_capital.order.id
                                                                JOIN nexa_capital.property ON transaction.prop_id = nexa_capital.property.id
                                                                WHERE nexa_capital.order.order_id =${req.body.order_id}
                                                                ORDER BY nexa_capital.transaction.createdAt DESC;`)
        } else {
            console.log('3')
            get_transaction = await Transaction.findAll({
                include: [
                    {
                        model: model.Client,
                        as: 'client_data'
                    },
                    {
                        model: model.Order,
                        as: 'order_data'
                    },
                    {
                        model: model.Enquiry_form,
                        as: 'enq_form_data'
                    },
                    {
                        model: model.Property,
                        as: 'prop_data'
                    }
                ],
                order: [['createdAt', 'DESC']],
            })
        }

        return res.status(200).json({
            message: "Success",
            get_transaction
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}
