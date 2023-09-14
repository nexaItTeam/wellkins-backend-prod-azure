const nodemailer = require("nodemailer");
const Mailgen = require('mailgen');

const mailGenerator = async (body) => {
    let config = {
        service: 'gmail',
        auth: {
            user: 'tejas.t.nexahomes@gmail.com',
            pass: 'actfczxickhuqhwy'
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Enquiry form",
            link: 'https://welkinscapital.com/'
        }
    })

    let response = {
        body: {
            name: "Wellkin Capital",
            intro: "Your account is created successfully",
            table: {
                data: [
                    {
                        Email: body.client_email,
                        Password: body.password,
                        ClientID: body.client_id,
                        temp_id: body.temp_id
                    }
                ]
            },
            outro: "Looking forward to do more investment"
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from: "tejas.t.nexahomes@gmail.com",
        to: body.client_email,
        subject: "Account Create",
        html: mail
    }

    return transporter.sendMail(message)
}

module.exports = { mailGenerator }
