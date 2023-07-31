const nodemailer = require('nodemailer');
require('dotenv').config();

const {UKR_NET_EMAIL, UKR_NET_PASSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465, // 25,465,2525
    secure: true,
    auth: {
        user: UKR_NET_EMAIL,
        pass: UKR_NET_PASSWORD
    }
}

const transport = nodemailer.createTransport(nodemailerConfig);

// const data = {
//     to: "casax20772@weizixu.com",
//     subject: "Verify email", // theme, topic
//     html: "<p>Verify Email</p>" // content
// }

const sendEmail = async(data) => {
    const email = {...data, from: UKR_NET_EMAIL};
    await transport.sendMail(email);
    return true;
}

module.exports = sendEmail;


// const email = {
//     from: UKR_NET_EMAIL,
//     to: "casax20772@weizixu.com",
//     subject: "Verify email",
//     html: "<p>Verify Email</p>"
// }

// transport.sendMail(email)
// .then(()=>console.log("email successfully sent"))
// .catch((e)=>console.log(e.message))