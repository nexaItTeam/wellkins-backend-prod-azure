const { Enquiry_form, Client, Document, Order } = require('../models')
const model = require('../models')
const { documents } = require('../middleware/Document')
const imgUpload = require('../middleware/ImmgUpload')
const { azureUpload } = require('../service/azure')
const generateUniqueId = require('generate-unique-id');

// get all form
exports.getAllOrder = async (req, res) => {
    try {
        var getOrder
        if (req.body.client_id != null) {
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
            await Enquiry_form.create(enq_form).then(async (resp) => {
                if (enq_form.isDraft != true) {
                    const order_id = generateUniqueId({
                        length: 10,
                        useLetters: false
                    })
                    var temp = {
                        order_id: order_id,
                        enq_form_id: enq_form.id,
                        client_id: enq_form.client_id,
                        prop_id: enq_form.prop_id,
                        paidStatus: enq_form.paidStatus,
                        investing_amount: enq_form.investing_amount,
                        paidStatus:enq_form.paidStatus
                    }
                    await Order.create(temp).then(() => {
                        return res.status(200).json({
                            message: "order place successfully"
                        })
                    }).catch((err) => {
                        return res.status(400).json({
                            message: "failed to create order"
                        })
                    })
                } else {
                    return res.status(200).json({
                        message: "save draft"
                    })
                }
            }).catch((err) => {
                return res.status(400).json({
                    message: "failed to create enquery form"
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

// get order
exports.getOrder = async (req, res) => {
    try {
        var get_order = await Order.findAll({
            where: {
                client_id: req.body.client_id
            },
            include: [
                {
                    model: model.Enquiry_form,
                    as: 'enq_foem_data'
                },
                {
                    model: model.Client,
                    as: 'enq_client_data'
                },
                {
                    model: model.Property,
                    as: 'enq_prop_data'
                }
            ]
        })

        if (!get_order) {
            return res.status(200).json({
                message: "Data not found",
            })
        } else {
            return res.status(200).json({
                message: "Success",
                get_order
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
            const order_id = generateUniqueId({
                length: 10,
                useLetters: false
            })
            var temp = {
                order_id: order_id,
                enq_form_id: enq_form.id,
                client_id: enq_form.client_id,
                prop_id: enq_form.prop_id,
                paidStatus: enq_form.paidStatus,
                investing_amount: enq_form.investing_amount,
                paidStatus:enq_form.paidStatus
            }
            await Order.create(temp).then(() => {
                return res.status(200).json({
                    message: "order place successfully",
                    update_form
                })
            }).catch((err) => {
                return res.status(400).json({
                    message: "failed to create order"
                })
            })
        } else {
            return res.status(200).json({
                message: "save draft",
                update_form
            })
        }
        // return res.status(200).send({
        //     message: "update post",
        //     update_form
        // })
    } catch (error) {
        console.log(error)
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
        const { order } = req.body
        var update_order = await Order.update(
            order,
            {
                where: {
                    id: order.id
                }
            })
        return res.status(200).json({
            message: "order update successfully",
            update_order
        })
    } catch (error) {
        return res.status(500).json({
            message: "server data",
            error
        })
    }
}
