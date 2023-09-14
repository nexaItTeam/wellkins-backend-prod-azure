const { EmailClient } = require("@azure/communication-email");
const Mailgen = require('mailgen');
require("dotenv").config();



const azureEmailService = async (body) => {
    // This code demonstrates how to fetch your connection string
    // from an environment variable.
    const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
    const emailClient = new EmailClient(connectionString);

    try {
        const message = {
            senderAddress: "<info@nexadesigngroup.com>",
            content: {
                subject: "Welcome to Azure Communication Services Email",
                plainText: "This email message is sent from Azure Communication Services Email using the JavaScript SDK.",
            },
            recipients: {
                to: [
                    {
                        address: "<tejas.d.talkar@gmail.com>",
                        displayName: "Customer Name",
                    },
                ],
            },
        };

        const poller = await emailClient.beginSend(message);
        const result = await poller.pollUntilDone();
        console.log("result", result)
        return result

        // if (!poller.getOperationState().isStarted) {
        //     throw "Poller was not started."
        // }

        // let timeElapsed = 0;
        // while (!poller.isDone()) {
        //     poller.poll();
        //     console.log("Email send polling in progress");

        //     await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
        //     timeElapsed += 10;

        //     if (timeElapsed > 18 * POLLER_WAIT_TIME) {
        //         throw "Polling timed out.";
        //     }
        // }

        // if (poller.getResult().status === KnownEmailSendStatus.Succeeded) {
        //     console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`);
        // }
        // else {
        //     throw poller.getResult().error;
        // }
    } catch (e) {
        console.log(e);
    }
}

module.exports = { azureEmailService }