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
                    html: body.body
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
        // const result = await poller.pollUntilDone();
        // return result
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
                        <p style="text-align:center">Thank you for expressing your interest in <strong>${body.property_name ? body.property_name + " " + 'Project!' : "Us"}&nbsp;</strong>&nbsp;</p>
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

const accountCreate = async (body) => {
    const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
    const emailClient = new EmailClient(connectionString);
    try {
        const message = {
            senderAddress: "<info@wellkins.com.au>",
            content: {
                subject: "Account Create",
                html: `<p>Dear <strong>${body.client_name}</strong>,</p>
                <p>Your Wellkins Investment&nbsp;account has been activated.</p>
                <p>Please save the below login details for your future reference. The password can be changed after first login.</p>
                <p>Login Id: <strong>${body.client_email}</strong></p>
                <p>Password: <strong>${body.password}</strong></p>
                <p>Client ID: <strong>${body.client_id}</strong></p>
                <p><a href='https://client.wellkins.com.au/login'><strong>Click to login into your account</strong></a></p>
                <p>&nbsp;</p>
                <p>Thanks &amp; Regards,</p>
                <p><span style="font-size:16px"><strong>Team Wellkins Capital</strong></span></p>
                <p><a href="https://wellkins.com.au/" rel="noopener noreferrer" target="_blank" title="&quot;https://wellkins.com.au/&quot; t ">
                <strong><em><img src="https://wellkinsstorageprod.blob.core.windows.net/assist/LOGO.png" style="height:32px; width:127px" /></em></strong></a></p>
                <h4>T: 02 9119 4947</h4>
                <h4>E:&nbsp;<a href="mailto:info@wellkins.com.au">info@wellkins.com.au</a></h4>
                <h4>W<strong>:</strong>&nbsp;<a href="https://wellkins.com.au/" rel="noopener noreferrer" target="_blank">https://wellkins.com.au/</a><br />
                A<strong>:&nbsp;&nbsp;</strong>4.01/5 Celebration Drive,&nbsp;Bella Vista&nbsp;NSW 2153</h4>`,
            },
            recipients: {
                to: [
                    {
                        address: body.client_email,
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

const invoice_Mail = async (body) => {
    console.log("cgvccghgh", body)
    const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
    const emailClient = new EmailClient(connectionString);
    try {
        const message = {
            senderAddress: "<info@wellkins.com.au>",
            content: {
                subject: "Account Create",
                html: `
                <html lang="en">
                    <head>
                        <title>Welkins Invoice</title>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
                    </head>
                    <style>
                        body {
                            background-color: #fff !important;
                        }
                    </style>
                    <body style="background-color: #fff;">
                        <section style="background-color: #fff;">
                            <div class="container" id="invoice">
                                <div class="row justify-content-center">
                                    <div class="col-lg-10 col-md-12">
                                        <div class="card">
                                            <div class="invoice-body" style="border-color: #0000002d;">
                                                <div class="container mb-5 mt-3">
                                                    <div class="row d-flex align-items-baseline mb-3">
                                                        <div class="col-xl-4">
                                                            <img class="pb-3"
                                                                src="https://wellkinsstorageprod.blob.core.windows.net/assist/wellkins-logo.png"
                                                                alt="Logo" width="200">
                                                            <p style="color:black"><strong>WELKINS CAPITAL LIMITED</strong> <br>
                                                                ABN 12 608 424 488 <br />
                                                                AFSL 482375
                                                            </p>
                                                        </div>
                                                        <div class="col-xl-8  text-end">
                                                            <h3 class=" text-end" style="color:black">INVESTMENT APPLICATION</h3>
                                                            <h5 class=" text-end" style="color:black">Wellkins Capital Fund (ARSN 614
                                                                577 276)</h5>
                                                            <ul class="list-unstyled"
                                                                style="max-width: 300px; margin-left: auto; margin-top: 20px;">
                                                                <li class="text-muted d-flex justify-content-between">
                                                                    <div><span style="color:black " class="fw-bold">Investment Date
                                                                            :</span></div>
                                                                    <div style="color:black">{{Date}}</div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div class="container">
                                                        <div class="row my-4">
                                                            <div class="col-xl-5">
                                                                <h5 style="color:black" class="fw-bold">${body.email.name}
                                                                </h5>
                                                                <ul class="list-unstyled" style="max-width: 200px; margin-right: auto;">
                                                                    <li class="text-muted d-flex justify-content-between">
                                                                        <div><span class="fw-bold" style="color:black">Phone:</span> 
                                                                                ${body.email.contactno} 
                                                                            </div>
                                                                        <div style="color:black"></div>
                                                                    </li>
                                                                    <li class="text-muted d-flex justify-content-between">
                                                                        <div>
                                                                            <span class="fw-bold" style="color:black">Email:</span>
                                                                            ${body.email.email}
                                                                        </div>

                                                                    </li>
                                                                    <li class="text-muted d-flex justify-content-between">
                                                                        <div><span class="fw-bold" style="color:black">Address:</span>
                                                                            ${body.email.address}</div>

                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div class="col-xl-7 text-end">
                                                                <ul class="list-unstyled">
                                                                    <h5 class="fw-bold" style="color:black"><strong>INVESTMENT
                                                                            METHOD</strong></h5>
                                                                    <p class="fw-bold" style="color:black;font-weight: bold;">
                                                                        <strong>Please deposit your investment monies to :</strong>
                                                                    </p>


                                                                    <div style="color:black">Perpetual Corporate Trust Limited
                                                                        -ACF-Wellkins Capital Limited</div>

                                                                    <li class="text-muted d-flex justify-content-between">
                                                                        <div><span class="fw-bold" style="color:black">Account No
                                                                                :</span></div>
                                                                        <div style="color:black">899667216</div>
                                                                    </li>
                                                                    <li class="text-muted d-flex justify-content-between">
                                                                        <div><span class="fw-bold" style="color:black">BSB :</span>
                                                                        </div>
                                                                        <div style="color:black">082057</div>
                                                                    </li>
                                                                    <li class="text-muted d-flex justify-content-between">
                                                                        <div><span style="color:black" class="fw-bold">Reference No
                                                                                :</span></div>
                                                                        <div style="color:black">${body.email.refno}</div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div class="row my-2 justify-content-center" style="font-size: 16px;">
                                                            <table class="table table-borderless mb-3">
                                                                <thead style="background-color:#c2272d ;" class="text-black">
                                                                    <tr style="background-color:#c2272d ; color: #fff;">
                                                                        <th style="background-color:#c2272d; color: #fff;" scope="col">
                                                                            Description</th>
                                                                        <th style="background-color:#c2272d; color: #fff;" scope="col">
                                                                            Price per share</th>
                                                                        <th style="background-color:#c2272d; color: #fff;" scope="col">
                                                                            Units</th>
                                                                        <th style="background-color:#c2272d; color: #fff;" scope="col">
                                                                            Monies Due to Be Paid</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <th scope="row">Wellkins Capital Fund <br> Class of Units :
                                                                            ${body.email.property_name}
                                                                        </th>
                                                                        <td>
                                                                            ${body.email.price_per_share}
                                                                        </td>
                                                                        <td>
                                                                            ${body.email.units}
                                                                        </td>
                                                                        <td>
                                                                            ${body.email.Monies_Due}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div style="border: 1.5px solid #c2272d"></div>
                                                        </div>
                                                        <div class="row mt-5" style="font-size: 16px;">
                                                            <div class="col-xl-6">
                                                                <p class="mb-3" style="color:black"><strong>TERMS AND
                                                                        CONDITIONS</strong></p>
                                                                <p style="color:black;font-weight: bold">Investment applications in the
                                                                    Wellkins Capital Fund will not be processed until cleared funds are
                                                                    received in full.
                                                                    <br> An investment in the Wellkins Capital Fund is not active until
                                                                    confirmed by Wellkins Capital Limited as responsible entity of the
                                                                    Wellkins
                                                                    Capital Fund.<br> You will receive a certificate of investment upon
                                                                    confirmation by Wellkins Capital Limited.
                                                                </p>
                                                            </div>
                                                            <div class="col-xl-6 text-end">
                                                                <ul class="list-unstyled"
                                                                    style="max-width: 300px; margin-left: auto; margin-top: 20px;">
                                                                    <li class="text-muted ms-3  d-flex justify-content-between">
                                                                        <div style="color: black;"><strong>SubTotal</strong></div>
                                                                        <div style="color: black;">{{Monies_Due |
                                                                            currency : 'USD' }}</div>
                                                                    </li>
                                                                    <li class="text-muted ms-3 mt-2  d-flex justify-content-between">
                                                                        <div style="color: black;"><strong>Immediately</strong></div>
                                                                        <div style="color: black;">${body.email.immediate_payment}</div>
                                                                    </li>
                                                                    <li class="text-muted ms-3 mt-3  d-flex justify-content-between">
                                                                        <div style="color: black;"><strong>Next
                                                                                Installment</strong></div>
                                                                        <div style="color: black;">${body.email.next_installment}
                                                                        </div>
                                                                    </li>
                                                                    <li class="text-muted ms-2 mt-3   d-flex justify-content-between"
                                                                        style="background-color: #c2272d;">
                                                                        <div style="color: #fff;"><strong>Due Now</strong></div>
                                                                        <div style="color: #fff;"> ${body.email.immediate_payment} </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <hr>
                                                        <table class="table table-borderless mb-3">
                                                            <thead style="background-color:#c2272d ;" class="text-black">
                                                                <tr style="background-color:#c2272d ; color: #fff;">
                                                                    <th style="background-color:#c2272d; color: #fff;text-align: center;font-style: italic;font-size: 15px;"
                                                                        scope="col">
                                                                        Kindly ignore this investment application if you have already
                                                                        made the payment.</th>
                                                                </tr>
                                                            </thead>
                                                        </table>
                                                        <div class="row" style="font-size: 16px;">
                                                            <div class="col-xl-10">
                                                                <p style="text-transform: uppercase; color:black"><strong>Thank you for
                                                                        your
                                                                        Investment</strong></p>
                                                                <ul class="list-unstyled">
                                                                    <li><span style="color: #c2272d;"><i
                                                                                class="k-icon k-font-icon k-i-user"></i> 02 9119
                                                                            4947</span> </li>
                                                                    <li><span style="color: #c2272d;"><i
                                                                                class="k-icon k-font-icon k-i-envelope "></i>
                                                                            info@wellkins.com.au</span>
                                                                    </li>
                                                                    <li><span style="color: #c2272d;"><i
                                                                                class=" k-icon k-font-icon k-i-globe "></i>
                                                                            www.wellkins.com.au</span>
                                                                    <li><span style="color: #c2272d;"><i
                                                                                class="k-icon k-font-icon k-i-map-marker"></i> 4.01/5
                                                                            Celebration Drive, Bella Vista NSW 2153 </span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div class="asterix--after"
                                                            style="font-weight: bold;text-align:center; font-style: italic; font-size: 15px;color: black;">
                                                            To ensure a timely allocation of your investment
                                                            monies, please deposit your investment monies as
                                                            soon as possible. Thank you.</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </body>
                    </html>
                `,
            },
            recipients: {
                to: [
                    {
                        address: body.email.email,
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


module.exports = { azureEmailService, forgotPassword, thankyouEmail, accountCreate, invoice_Mail }