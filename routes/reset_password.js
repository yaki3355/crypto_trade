const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {randStr} = require('../utils');

router.put('/reset_password', async (req, res, next) => {
    const {email, email_reset_code, password} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) return res.status(400).send('Email not exists');
        if (!(await bcrypt.compare(email_reset_code, user.email_reset_code))) return res.status(400).send('Invalid verification code');

        const erc = await bcrypt.hash(randStr(), 10);
        const p = await bcrypt.hash(password, 10);

        await user.updateOne({password: p, email_reset_code: erc});

        res.sendStatus(200);
    } catch(err) {
        next(err);
    }
});

module.exports = router;