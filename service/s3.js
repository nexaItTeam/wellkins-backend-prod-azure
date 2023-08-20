const { S3 } = require('aws-sdk')

exports.imageUpload = async (file) => {
    console.log("file",file)
    const s3 = new S3()
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `property/${file.originalname}`,
        Body: file.buffer,
        ContentType: 'image/png',
        ContentEncoding: 'base64'
    }

    return s3.upload(params).promise()
    // const params = files.map(file => {
    //     return {
    //         Bucket: process.env.AWS_BUCKET_NAME,
    //         Key: `property/${file.originalname}`,
    //         Body: file.buffer,
    //         ContentType: 'image/png',
    //         ContentEncoding: 'base64'
    //     }
    // })
    // return Promise.all(params.map(param => s3.upload(param).promise()))
}
