const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
const { DefaultAzureCredential } = require('@azure/identity');


exports.azureImgUpload = async (file) => {
    console.log(file)
    const AZURE_STORAGE_CONNECTION_STRING =
        process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error('Azure Storage Connection string not found');
    } else { 
        console.log("connect with azure")
    }

    // Create the BlobServiceClient object with connection string
    const blobServiceClient = await BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );

    // connect with exesting container
    const containerName = "brochure";
    const containerClient = await blobServiceClient.getContainerClient(containerName)

    // insert file in to the container
    const file_name = "test.txt"

    const blockBlobClient = containerClient.getBlockBlobClient(file_name);

    // const uploadeBlobResponse = await blockBlobClient.upload(file_name, file_name.length)

    return blockBlobClient.upload(file_name, file_name.length).promise()
}