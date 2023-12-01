const { EmailClient } = require("@azure/communication-email");
const Mailgen = require('mailgen');
require("dotenv").config();

const azureEmailService = async (body) => {
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
    } catch (e) {
        console.log(e);
        return e
    }
}

const multipleAccount = async (body) => {
    const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
    const emailClient = new EmailClient(connectionString);
    try {
        const messages = body.map(file => {
            return {
                senderAddress: "<info@wellkins.com.au>",
                content: {
                    subject: "Account Create",
                    html: `<p>Dear <strong>${file.full_name}</strong>,</p>
                            <p>Your Wellkins Investment&nbsp;account has been activated.</p>
                            <p>Please save the below login details for your future reference. The password can be changed after first login.</p>
                            <p>Login Id: <strong>${file.client_email}</strong></p>
                            <p>Password: <strong>${file.password}</strong></p>
                            <p>Client ID: <strong>${file.client_id}</strong></p>
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
                            address: file.client_email,
                            displayName: "Customer Name",
                        },
                    ],
                }
            }
        })
        return Promise.all(messages.map(
            (message) => emailClient.beginSend(message)
        ))
    } catch (e) {
        console.log(e);
        return e
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



const invoice_Mail = async (body) => {
    console.log(body)
    const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
    const emailClient = new EmailClient(connectionString);
    try {
        const message = {
            senderAddress: "<info@wellkins.com.au>",
            content: {
                subject: "Terms Of Payment",
                html: `
                <html lang="en">          
                <head>
                <title>Welkins Invoice</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
                <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,300;1,400;1,600&amp;family=Poppins:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
            <style>
                body {
                  background-color: #fff!important;
                  font-size: 14px!important;
                  font-family: 'Poppins', sans-serif!important;
                }
                .custom-space-padding td{
                    padding: 10px 5px 5px 0!important;
                    font-size: 13px!important;
                }
            </style></head>
            
            <body style="background-color: #fff!important;
            font-size: 14px!important;
            font-family: 'Poppins', sans-serif!important;">
                
                <section style="background-color: #fff;">
                    <div class="container pt-3" id="invoice" #datatoexport="" style="max-width: 1140px;    padding-top: 1rem!important;">
                        <div class="row  justify-content-center mb-5" style="margin-bottom: 3rem!important;justify-content: center!important;display: flex; justify-content: center;     flex-wrap: wrap;
                        margin-right: -15px;
                        margin-left: -15px;">
                            <div class="col-lg-10 col-md-12" style="flex: 0 0 auto;
                            width: 83.33333333%;">
                                <div class="row justify-content-around justify-content-center" style="justify-content: center!important;display: flex; justify-content: center;     flex-wrap: wrap;
                                margin-right: -15px;
                                margin-left: -15px;">
                                    <div class="col-lg-6" style="flex: 0 0 auto;
                                    width: 50%;">
                                       
                                        
                                    </div>
                                    <div class="col-lg-6 text-end" style="text-align: right!important;flex: 0 0 auto;
                                    width: 50%;">
                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                     
                        <div class="row justify-content-center" style="justify-content: center!important;display: flex;flex-wrap: wrap;margin-right: -15px;margin-left: -15px;">
                            <div class="col-lg-10 col-md-12" style="flex: 0 0 auto; width: 83.33333333%;">
                                <div class="card" style="    position: relative;
                                display: -ms-flexbox;
                                display: flex;
                                -ms-flex-direction: column;
                                flex-direction: column;
                                min-width: 0;
                                word-wrap: break-word;
                                background-color: #fff;
                                background-clip: border-box;
                                border: 1px solid rgba(0,0,0,.125);
                                border-radius: 0.25rem;">
                                    <!-- <mat-icon (click)="navigate()" iconPositionEnd>clear</mat-icon> -->
                                    <div class="invoice-body" style="border-color: #0000002d;">
                                        <div class="container mb-5 mt-3" style="margin-bottom: 3rem!important;    margin-top: 1rem!important;max-width: 1140px; padding: 0 30px;">
                                            <div class="row d-flex align-items-top mb-3" style="display: flex; align-items: flex-start!important; margin-bottom: 1rem!important;">
                                                <div class="col-xl-4" style="flex: 0 0 auto;
                                                width: 33.33333333%;">
                                                    <img class="pb-3" src="https://wellkinsstorageprod.blob.core.windows.net/assist/wellkins-logo.png" alt="Logo" width="100">
                                                    <p style="color:black"><strong>WELKINS CAPITAL LIMITED</strong> <br>
                                                        ABN 12 608 424 488 <br>
                                                        AFSL 482375
                                                    </p>
                                                </div>
                                                <div class="col-xl-8  text-end" style="text-align: right!important;flex: 0 0 auto;
                                                width: 66.66666667%;">
                                                    <h4 class="text-end" style="color:black; font-weight: bold;    text-align: right!important;font-size: 1.5rem; margin: 0;">INVESTMENT APPLICATION</h4>
                                                    <h5 class=" text-end" style="color:black; font-weight: bold;text-align: right!important;font-size: 1.25rem;margin: 0;">Wellkins Capital Limited (ARSN 614 577 276)</h5>
                                                    
                                                        
                                                            <div><span style="color:black; font-weight: 700!important;" class="fw-bold">Investment Date :</span></div>
                                                            <div style="color:black">${body.date}</div>
                                                       
                                                      
                                                   
                                                </div>
                                            </div>
            
                                            <div class="container" style="max-width: 1140px;">
                                                <div class="row my-4" style="margin-top: 1.5rem!important;
                                                margin-bottom: 1.5rem!important;display: -ms-flexbox;
                display: flex;
                -ms-flex-wrap: wrap;
                flex-wrap: wrap;
                margin-right: -15px;
                margin-left: -15px;">
                                                    <div class="col-xl-5" style="flex: 0 0 auto;
                                                    width: 41.66666667%;">
                                                        <h5 style="color:black;font-weight: 700!important;font-size: 1.25rem;margin: 0;" class="fw-bold">${body.name
                    }
                                                       </h5>
                                                        <ul class="list-unstyled" style="padding-left: 0;
                                                        list-style: none;margin-bottom: 1rem;">
                                                            <table class="table table-borderless" style="caption-side: bottom;
                                                            border-collapse: collapse;">
                                                                <tbody><tr class="custom-space-padding" style="    border-color: inherit;
                                                                border-style: solid;
                                                                border-width: 0;">
                                                                    <td class="p-0" style="padding: 10px 5px 5px 0!important;
                                                                    font-size: 13px!important;"><span class="fw-bold p-0" style="color:black">Phone:</span></td>
                                                                    <td class="p-0" style="padding: 10px 5px 5px 0!important;
                                                                    font-size: 13px!important;"><span class="text-muted p-0">${body.contactno}</span></td>
                                                                </tr>
                                                                <tr class="custom-space-padding">
                                                                    <td class="p-0" style="padding: 10px 5px 5px 0!important;
                                                                    font-size: 13px!important;"><span class="fw-bold p-0" style="color:black">Email:</span></td>
                                                                    <td class="p-0" style="padding: 10px 5px 5px 0!important;
                                                                    font-size: 13px!important;"><span class="text-muted p-0">${body.email}</span></td>
                                                                </tr>
                                                                <tr class="custom-space-padding" style="padding: 10px 5px 5px 0!important;
                                                                font-size: 13px!important;">
                                                                    <td class="p-0" style="padding: 10px 5px 5px 0!important;
                                                                    font-size: 13px!important;"><span class="fw-bold p-0" style="color:black">Address:</span></td>
                                                                    <td class="p-0" style="padding: 10px 5px 5px 0!important;
                                                                    font-size: 13px!important;"><span class="text-muted p-0"> ${body.address}</span></td>
                                                                </tr>
                                                            </tbody></table>
                                                           
                                                         
                                                        </ul>
                                                    </div>
                                                    <div class="col-xl-7 text-end" style="flex: 0 0 auto;
                                                    width: 58.33333333%;text-align: right!important;">
                                                        <ul class="list-unstyled" style="padding-left: 0;
                                                        list-style: none;">
                                                            <h5 class="fw-bold" style="color:black;     font-weight: 700!important;font-size: 1.25rem; margin: 0;"><strong>INVESTMENT METHOD</strong></h5>
                                                            <p class="fw-bold " style="color:black;font-weight: bold;"><strong>Please deposit your investment monies to :</strong></p>
                                                            
                                                               
                                                                <div style="color:black; margin-bottom: 10px;">Perpetual Corporate Trust Limited  -ACF-Wellkins Capital Limited</div>
            
                                                                <table class="table table-borderless" style="caption-side: bottom;
                                                                border-collapse: collapse; float: right;">
                                                                    <tbody><tr class="custom-space-padding">
                                                                        <td class="p-0" style="padding: 10px 5px 5px 0!important;
                                                                        font-size: 13px!important;"><span class="fw-bold p-0" style="color:black">Account No :</span></td>
                                                                        <td class="p-0" style="padding: 10px 5px 5px 0!important; text-align: right;
                                                                        font-size: 13px!important;"><span class="p-0" style="color:black ">899667216</span></td>
                                                                    </tr>
                                                                    <tr class="custom-space-padding">
                                                                        <td class="p-0" style="padding: 10px 5px 5px 0!important;
                                                                        font-size: 13px!important;"><span class="fw-bold p-0" style="color:black">BSB :</span></td>
                                                                        <td class="p-0" style="padding: 10px 5px 5px 0!important;text-align: right;
                                                                        font-size: 13px!important;"> <span class="p-0" style="color:black">082057</span></td>
                                                                    </tr>
                                                                    <tr class="custom-space-padding">
                                                                        <td class="p-0" style="padding: 10px 5px 5px 0!important;
                                                                        font-size: 13px!important;"><span style="color:black" class="fw-bold p-0">Reference No :</span></td>
                                                                        <td class="p-0" style="padding: 10px 5px 5px 0!important;text-align: right;
                                                                        font-size: 13px!important;"><span class="p-0" style="color:black">${body.refno}</span></td>
                                                                    </tr>
                                                                </tbody></table>
                                                          
                                                          
                                                        </ul>
                                                    </div>
                                                </div>
            
                                                <div class="row my-2 justify-content-center" style="font-size: 16px;display: -ms-flexbox;
                                                display: flex;
                                                -ms-flex-wrap: wrap;
                                                flex-wrap: wrap;
                                                margin-right: -15px;
                                                margin-left: -15px;margin-top: 0.5rem!important;margin-bottom: 0.5rem!important;">
                                                    <table class="table table-borderless mb-3" style="margin-bottom: 1rem!important;caption-side: bottom;
                                                    border-collapse: collapse; width:100%;    display: table;
                border-collapse: separate;
                box-sizing: border-box;
                text-indent: initial;
                border-spacing: 2px;
                border-color: gray;">
                                                        <thead style="background-color:#c2272d;vertical-align:bottom;" class="text-black">
                                                            <tr style="background-color:#c2272d;color: #fff;">
                                                                <th style="background-color:#c2272d; color: #fff;" scope="col">
                                                                    Description</th>
                                                                <th style="background-color:#c2272d; color: #fff;" scope="col">Price per Unit</th>
                                                                <th style="background-color:#c2272d; color: #fff;" scope="col">
                                                                    Units</th>
                                                                <th style="background-color:#c2272d; color: #fff;" scope="col">
                                                                    Monies Due to Be Paid</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr style="border-color: inherit;
                                                            border-style: solid;
                                                            border-width: 0;text-align: left ">
                                                                <th scope="row">Wellkins Capital Limited <br> Class of Units :  ${body.prop_name}</th>
                                                                <td>${body.price_per_share}</td>
                                                                <td>${body.units}</td>
                                                                <td>${body.Monies_Due}</td>
                                                            </tr>
                                                        </tbody>
            
                                                    </table>
                                                    <div style="border: 1.5px solid #c2272d;"></div>
                                                </div>
                                                <div class="row mt-5" style="font-size: 16px;margin-top: 3rem!important;display: -ms-flexbox;
                                                display: flex;
                                                -ms-flex-wrap: wrap;
                                                flex-wrap: wrap;
                                                margin-right: -15px;
                                                margin-left: -15px;">
                                                    <div class="col-xl-6" style="flex: 0 0 auto;
                                                    width: 50%;">
                                                        <p class="mb-3" style="color:black;margin-bottom: 1rem!important;"><strong>TERMS AND CONDITIONS</strong></p>
                                                        
            <p style="color:black;font-weight: normal; font-size: 13px; line-height: 25px;">Investment applications in the Wellkins Capital Limited will not be processed until cleared funds are received in full.
                <br> An investment in the Wellkins Capital Limited is not active until confirmed by Wellkins Capital Limited as responsible entity of the Wellkins
                Capital Limited.<br> You will receive a certificate of investment upon confirmation by Wellkins Capital Limited.</p>
            
                                                    </div>
                                                    <div class="col-xl-6 text-end" style="text-align: right!important; flex: 0 0 auto;
                                                    width: 50%;">
                                                        <ul class="list-unstyled" style="max-width: 300px; margin-left: auto; margin-top: 20px;padding-left: 0;
                                                        list-style: none;">
                                                            <li class="text-muted ms-3  d-flex justify-content-between" style="display: flex; align-items: center; justify-content: space-between;margin-left: 1rem!important;">
                                                                <div style="color: black;"><strong>SubTotal</strong></div>
                                                                <div style="color: black;">${body.Monies_Due}</div>
                                                            </li>
                                                            <li class="text-muted ms-3 mt-2  d-flex justify-content-between" style="display: flex; align-items: center; justify-content: space-between;margin-left: 1rem!important;">
                                                                <div style="color: black;"><strong>Immediately</strong></div>
                                                                <div style="color: black;"> ${body.immediate_payment}</div>
                                                            </li>
            
                                                            <li class="text-muted ms-3 mt-3  d-flex justify-content-between" style="display: flex; align-items: center; justify-content: space-between;margin-left: 1rem!important;">
                                                                <div style="color: black;"><strong>Next
                                                                        Installment</strong></div>
                                                                <div style="color: black;">${body.next_installment}</div>
                                                            </li>
            
                                                            <li class="text-muted ms-2 mt-3   d-flex justify-content-between" style="background-color: #c2272d; padding: 5px 5px;display: flex; align-items: center; justify-content: space-between;margin-left: 1rem!important;">
                                                                <div style="color: #fff;"><strong>Due Now</strong></div>
                                                                <div style="color: #fff;"> ${body.immediate_payment} </div>
                                                            </li>
            
                                                        </ul>
            
                                                    </div>
                                                </div>
                                                <hr>
                                                <table class="table table-borderless mb-3" style="margin-bottom: 1rem!important;caption-side: bottom;
                                                border-collapse: collapse;width: 100%;">
                                                    <thead style="background-color:#c2272d ;" class="text-black">
                                                        <tr style="background-color:#c2272d ; color: #fff;">
                                                            <th style="background-color:#c2272d; color: #fff;text-align: center;font-style: italic;font-size: 15px;" scope="col">
                                                                Kindly ignore this investment application if you have already made the payment.</th>
                                                                </tr>
                                                    </thead>
                                                    </table>
                                                <div class="row" style="font-size: 16px;    display: -ms-flexbox;
                                                display: flex;
                                                -ms-flex-wrap: wrap;
                                                flex-wrap: wrap;
                                                margin-right: -15px;
                                                margin-left: -15px;">
                                                    <div class="col-xl-10" style="flex: 0 0 auto;
                                                    width: 83.33333333%;">
                                                        <p style="text-transform: uppercase; color:black;margin-top: 0;
                                                        margin-bottom: 1rem;"><strong>Thank you for your
                                                                Investment</strong></p>
                                                        <ul class="list-unstyled" style="    padding-left: 0;
                                                        list-style: none;">
                                                            <li style="font-size: 13px; padding-bottom: 5px;"><span style="color: #c2272d;"><i class="k-icon k-font-icon k-i-user"></i> 02 9119 4947</span> </li>
                                                            <li style="font-size: 13px; padding-bottom: 5px;"><span style="color: #c2272d;"><i class="k-icon k-font-icon k-i-envelope "></i> info@wellkins.com.au</span>
                                                                </li>
                                                            <li style="font-size: 13px; padding-bottom: 5px;"><span style="color: #c2272d;"><i class=" k-icon k-font-icon k-i-globe "></i> www.wellkins.com.au</span> 
                                                                </li><li style="font-size: 13px; padding-bottom: 5px;"><span style="color: #c2272d;"><i class="k-icon k-font-icon k-i-map-marker"></i> 4.01/5 Celebration Drive, Bella Vista NSW 2153 </span> 
                                                            </li>
                                                        </ul>
                                                    </div>
            
                                                </div>
                                              <div class="asterix--after" style="font-weight: bold;text-align:center; font-style: italic; font-size: 15px;color: black;">
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
                        address: body.email,
                        displayName: "Customer Name",
                    },
                ],
            }
        };
        const poller = await emailClient.beginSend(message);
        const result = await poller.pollUntilDone();
        console.log(body.email.email)
        return result
    } catch (error) {
        return error
    }
}


module.exports = { azureEmailService, forgotPassword, thankyouEmail, accountCreate, invoice_Mail, multipleAccount }