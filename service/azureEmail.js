const { EmailClient } = require("@azure/communication-email");
const Mailgen = require('mailgen');
require("dotenv").config();

const azureEmailService = async (body) => {
    // This code demonstrates how to fetch your connection string
    // from an environment variable.
    const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
    const emailClient = new EmailClient(connectionString);
    try {
        const messages = body.email.map(file => {
            return {
                senderAddress: "<info@wellkins.com.au>",
                content: {
                    subject: body.subject,
                    // plainText: body.body,
                    html: "<html><h1>tejas</h1></html>"
                },
                recipients: {
                    to: [
                        {
                            address: file.user_email,
                            displayName: "Customer Name",
                        },
                    ],
                }
            }
        })
        return Promise.all(messages.map(
            (message) => emailClient.beginSend(message)
        ))

        // const message = {
        //     senderAddress: "<info@wellkins.com.au>",
        //     content: {
        //         subject: "Welcome to Azure Communication Services Email",
        //         plainText: "This email message is sent from Azure Communication Services Email using the JavaScript SDK.",
        //     },
        //     recipients: {
        //         to: [
        //             {
        //                 address: body.user_email,
        //                 displayName: "Customer Name",
        //             },
        //         ],
        //     }
        // };
        // const poller = await emailClient.beginSend(message);
        // // const result = await poller.pollUntilDone();
        // return poller
    } catch (e) {
        console.log(e);
        return e
    }
}

const forgotPassword = async (body) => {
    const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
    const emailClient = new EmailClient(connectionString);
    try {
        const message = {
            senderAddress: "<info@wellkins.com.au>",
            content: {
                subject: "Verify your Email",
                html: `<p>Enter <b>${body.otp}</b> in the app to verfiy your email address and complete security process</p>
                <p>This code <b>expires in 10 min</b>.</p>`,
            },
            recipients: {
                to: [
                    {
                        address: body.email,
                        displayName: "Customer Name",
                    },
                ],
            }
        };
        const poller = await emailClient.beginSend(message);
        const result = await poller.pollUntilDone();
        return result
    } catch (error) {
        return error
    }
}
module.exports = { azureEmailService, forgotPassword }