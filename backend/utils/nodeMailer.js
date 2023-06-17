const nodeMailer = require('nodemailer');

const sendEmailAsync = async (options) => {
    // 1) Create a transporter
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.email,
        subject: options.subject ?? null,
        text: options.message ?? null,
        html: options.html ?? null,
    };

    // 3) Actually send the email
    transporter.sendMail(mailOptions)
    .catch((err) => {
        console.log("sending email error: ",err);
    });
};  

module.exports = sendEmailAsync;
