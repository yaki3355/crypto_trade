const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {randStr} = require('../utils');
const sendEmail = require('../utils/send_email');

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
