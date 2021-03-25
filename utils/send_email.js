const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cryptotrade3355@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports = async function sendEmail(address, username, code) {
    await transport.sendMail({
        to: address,
        subject: 'Crypto trade - reset password',
        html: 'Hi '+ username + '<br><br>'
                + 'A request has been received to change the password for your Crypto trade account<br><br>'
                + 'Verification code: ' + code
    });
};