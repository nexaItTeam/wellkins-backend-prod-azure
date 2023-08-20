const { Property, PropertyIMG } = require('../models')
const { azureImgUpload } = require('../service/azure')
// const s3 = require('../service/s3')

exports.getAllProperty = async (req, res) => {
    try {
        var getAll = await Property.findAndCountAll({
            where: {
                isDelete: false
            },
            // order: [['createdAt', 'DESC']],
            limit: req.body.limit,
            offset: req.body.offset
        })
        if (!getAll) {
            return res.status(404).json({
                message: "Data not found"
            })
        } else {
            return res.status(200).json({
                message: "Success",
                getAll
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.addProperty = async (req, res) => {
    try {
        const { property } = req.body
        var create_property = await Property.create(property)
        if (!create_property) {
            return res.status(404).json({
                message: "failed to create"
            })
        } else {
            return res.status(200).json({
                message: "created",
                create_property
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

exports.updateProperty = async (req, res) => {
    try {
        const { property } = req.body
        var updateProperty = await Property.update(
            property,
            {
                where: {
                    id: property.id
                }
            }
        )
        return res.status(200).send({
            message: "update User",
            updateProperty
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.deleteProperty = async (req, res) => {
    try {
        const prop_id = req.body.id
        const data = await Property.findAll({ where: { id: prop_id } })
        if (!data) {
            return res.status(404).json({
                message: "post not found"
            })
        } else {
            Property.update({
                isDelete: true
            }, {
                where: {
                    id: req.body.id
                }
            }).then((_) => {
                res.status(200).send({
                    message: "Delete",
                    // data
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

exports.deleteImg = async (req, res) => {
    const img_id = req.body.id
    const data = await PropertyIMG.findAll({ where: { id: img_id } })
    if (!data) {
        return res.status(404).json({
            message: "img not found"
        })
    } else {
        PropertyIMG.update({
            isDelete: true
        }, {
            where: {
                id: img_id
            }
        }).then((_) => {
            res.status(200).send({
                message: "Delete",
                // data
            })
        })
    }
}

exports.uploadImg = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        var file = req.files
        var propertyArray = []

        file.map((fileName) => {
            var temp = {
                "prop_id": id,
                "property_img": fileName.path
            }
            propertyArray.push(temp)
        })
        var upload_img = await PropertyIMG.bulkCreate(propertyArray)


        if (upload_img) {
            return res.status(200).json({
                message: "Image upload success"
            })
        }

        else {
            return res.status(400).json({
                message: "failed to upload"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}

exports.getPropertyImg = async (req, res) => {
    try {
        var data = await PropertyIMG.findAll(
            {
                where:
                {
                    prop_id: req.body.prop_id,
                    isDelete: true
                }
            }
        )
        if (data.length === 0) {
            data = await PropertyIMG.findAll()
            function removeDuplicates(array, property) {
                const uniqueArray = [];
                const propertySet = new Set();
                for (const obj of array) {
                    const value = obj[property];
                    if (!propertySet.has(value)) {
                        propertySet.add(value);
                        uniqueArray.push(obj);
                    }
                }
                return uniqueArray;
            }
            data = removeDuplicates(data, "prop_id")

        }
        if (!data) {
            return res.status(404).json({
                message: "img not found"
            })
        } else {
            res.status(200).send({
                message: "Prop IMG",
                data
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

exports.getPropertyImgById = async (req, res) => {
    var data = await PropertyIMG.findAll(
        {
            where:
            {
                prop_id: req.body.prop_id,
                isDelete: false
            }
        }
    )
    if (data) {
        res.status(200).send({
            message: "Prop IMG",
            data
        })
    } else {
        res.status(404).send({
            message: "Data Not Found",
        })
    }
}

// exports.addPropImg = async (req, res) => {
//     try {
//         const id = parseInt(req.params.id)
//         const file = req.file
//         const result = await s3.imageUpload(file)
//         var temp = {
//             "prop_id": id,
//             "property_img": result.Key,
//             "img_type": req.body.img_type
//         }
//         var upload_img = await PropertyIMG.create(temp)
//         if (upload_img) {
//             res.status(200).json({
//                 message: "Success upload",
//             })
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message: "Server Error",
//             error
//         })
//     }
// }

exports.uploadeImg = async (req, res) => {
    try {
        const file = req.file
        const azure = await azureImgUpload(file)
        console.log(azure)
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}


