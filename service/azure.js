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

    // var containerName
    // var data
    // var blobContentType
    // connect with exesting container
    if (file.fieldname === 'brochure') {
        data = Buffer.from("BASE-64-ENCODED-PDF", "base64");
    }


    const containerClient = await blobServiceClient.getContainerClient(file.fieldname)

    // insert file in to the container
    // const file_name = "test.pdf";

    const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);

    // const uploadeBlobResponse = await blockBlobClient.upload(file_name, file_name.length)




    const responce = await blockBlobClient.uploadData(data, {
        blobHTTPHeaders: {
            blobContentType: file.mimetype,
        },
    })
    return responce
}