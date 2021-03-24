const router = require('express').Router();
const bcrypt = require('bcrypt');
const protonmailApi = require('protonmail-api');
const User = require('../models/user');
const {randStr} = require('../utils');

router.put('/email_reset_code', async (req, res, next) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) return res.status(400).send('Email not exists');

        const code = randStr();
        const hash = await bcrypt.hash(code, 10);

        await user.updateOne({email_reset_code: hash});
        await sendEmail(email, user.username, code);
        res.sendStatus(200);
    } catch(err) {
        next(err);
    }
});

module.exports = router;

function sendEmail(address, username, code) {
    return new Promise(async res => {
        const pm = await protonmailApi.connect({
            username: 'nodemailer3355@protonmail.com',
            password: process.env.PROTONMAIL_PASSWORD
        });
        
        await pm.sendEmail({
            to: address,
            subject: 'Crypto trade - reset password',
            body: 'Hi '+ username + '<br><br>'
                   + 'A request has been received to change the password for your Crypto trade account<br><br>'
                   + 'Verification code: ' + code
        });
        
        pm.close();
        res();
    });
}