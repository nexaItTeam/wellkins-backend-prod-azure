const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
const { DefaultAzureCredential } = require('@azure/identity');


exports.azureUpload = async (file) => {
    console.log(file)
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error('Azure Storage Connection string not found');
    } else {
        console.log("connect with azure")
    }
    const blobServiceClient = await BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );
    if (file.fieldname === 'brochure') {
        data = Buffer.from("BASE-64-ENCODED-PDF", "base64");
    } else if (file.fieldname === 'property') { 
        data = Buffer.from(file.buffer, "base64");
    }
    const containerClient = await blobServiceClient.getContainerClient(file.fieldname)
    const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
    const responce = await blockBlobClient.uploadData(data, {
        blobHTTPHeaders: {
            blobContentType: file.mimetype,
        },
    })
    return responce
}