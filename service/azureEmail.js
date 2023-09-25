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
                <p>This code <b>expires in 10 min</b>.</p> 
                <p><strong><em>&nbsp;</em></strong><a href="https://wellkins.com.au/" rel="noopener noreferrer" target="_blank"title="&quot;https://wellkins.com.au/&quot; t">
                <strong><em>
                <img src="https://wellkinsstorageprod.blob.core.windows.net/assist/LOGO.png"/>
                </em></strong></a></p>
                <h4>T: 02 9119 4947</h4>
                <h4>E:&nbsp;<a href="mailto:info@wellkins.com.au">info@wellkins.com.au</a></h4>
                <h4>W<strong>:</strong>&nbsp;<a href="https://wellkins.com.au/" rel="noopener noreferrer"
                target="_blank">https://wellkins.com.au/</a><br />
                A<strong>:&nbsp;&nbsp;</strong>4.01/5 Celebration Drive,&nbsp;Bella Vista&nbsp;NSW 2153</h4>`,
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

const thankyouEmail = async (body) => {
    const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
    const emailClient = new EmailClient(connectionString);
    try {
        const message = {
            senderAddress: "<info@wellkins.com.au>",
            content: {
                subject: "Thankyou Email",
                html: `<p style="text-align:center"><span style="font-size:22px"><strong>Hello!&nbsp;</strong></span></p>
                        <p style="text-align:center"><strong><img id="x_Picture_x0020_9"
                        src="https://wellkinsstorageprod.blob.core.windows.net/assist/thankyou.png"
                        style="height:418px; width:637px" /></strong></p>
                        <p style="text-align:center">Thank you for expressing your interest in <strong>${body.property_name ? body.property_name +" " +'Project!': "Us"}&nbsp;</strong>&nbsp;</p>
                        <p style="text-align:center">We&#39;re thrilled to see your enthusiasm and eagerness to learn more.</p>
                        <p style="text-align:center">&nbsp;</p>
                        <p><strong><em>&nbsp;</em></strong><a href="https://wellkins.com.au/" rel="noopener noreferrer" target="_blank"
                        title="&quot;https://wellkins.com.au/&quot; t"><strong><em><img id="x__x0000_i1037"
                        src="https://wellkinsstorageprod.blob.core.windows.net/assist/LOGO.png" /></em></strong></a>
                        </p>
                        <h4>T: 02 9119 4947</h4>
                        <h4>E:&nbsp;<a href="mailto:info@wellkins.com.au">info@wellkins.com.au</a></h4>
                        <h4>W<strong>:</strong>&nbsp;<a href="https://wellkins.com.au/" rel="noopener noreferrer"
                        target="_blank">https://wellkins.com.au/</a><br />
                        A<strong>:&nbsp;&nbsp;</strong>4.01/5 Celebration Drive,&nbsp;Bella Vista&nbsp;NSW 2153</h4>`,
            },
            recipients: {
                to: [
                    {
                        address: body.user_email,
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
module.exports = { azureEmailService, forgotPassword, thankyouEmail }