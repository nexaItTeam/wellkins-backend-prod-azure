const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
const { DefaultAzureCredential } = require('@azure/identity');


exports.azureUpload = async (file, client_id) => {
    console.log(client_id + file.originalname)
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
        data = Buffer.from(file.buffer, "base64");
    } else if (file.fieldname === 'pds') {
        data = Buffer.from(file.buffer, "base64");
    } else if (file.fieldname === 'spds') {
        data = Buffer.from(file.buffer, "base64");
    } else if (file.fieldname === 'tdm') {
        data = Buffer.from(file.buffer, "base64");
    } else if (file.fieldname === 'fsg') {
        data = Buffer.from(file.buffer, "base64");
    }
    else if (file.fieldname === 'property' || file.fieldname === 'document') {
        data = Buffer.from(file.buffer, "base64");
    }
    const containerClient = await blobServiceClient.getContainerClient(file.fieldname)
    var blockBlobClient
    if (client_id != null) {
        blockBlobClient = containerClient.getBlockBlobClient(client_id + file.originalname);
    } else {
        blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
    }
    const responce = await blockBlobClient.uploadData(data, {
        blobHTTPHeaders: {
            blobContentType: file.mimetype,
        },
    })
    return responce
}