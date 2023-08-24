const { Enquiry_form, Client } = require('../models')
const model = require('../models')
const { documents } = require('../middleware/Document')

exports.getEnqForm = async (req, res) => {
    try {
        var get_Enq_Form = await Enquiry_form.findOne({
            where: {
                isDelete: false,
                client_id: req.body.client_id
            }
        })
        if (!get_Enq_Form) {
            return res.status(404).json({
                message: "Something went wrong"
            })
        } else {
            return res.status(200).json({
                message: "Success",
                get_Enq_Form
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

exports.addEnqForm = async (req, res) => {
    try {
        const { enq_form } = req.body
        // find user in client table
        const find_user = await Client.findOne({
            where: {
                id: enq_form.client_id
            }
        })

        // find form by client id
        const find_form = await Enquiry_form.findOne({
            where: {
                client_id: enq_form.client_id
            }
        })
        if (find_form) {
            return res.status(400).json({ message: "User not allow to fill form again" })
        } else if (!find_user) {
            return res.status(400).json({ message: "User not found" })
        } else {
            var create_form = await Enquiry_form.create(enq_form)
            if (!create_form) {
                return res.status(404).json({
                    message: "failed to create"
                })
            } else {
                return res.status(200).json({
                    message: "created",
                    create_form
                })
            }
        }
    } catch (error) {
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
                    id: enq_form.id
                }
            }
        )
        return res.status(200).send({
            message: "update post",
            update_form
        })
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
      
    } catch (error) {

    }
}
