const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {randStr} = require('../utils');

router.post('/register', async (req, res, next) => {
    const {username, email, password} = req.body;

    try {
        if (await User.countDocuments({}) >= process.env.MAX_USERS_TO_CREATE)
            return res.status(400).send('Registration is now closed, please contact Admin');

        if (await User.findOne({username})) return res.status(400).send('Username already exists');

        if (await User.findOne({email})) return res.status(400).send('Email already exists');

        const hash = await bcrypt.hash(password, 10);
        const erc = await bcrypt.hash(randStr(), 10);

        const newUser = new User({
            username,
            email,
            password: hash,
            email_reset_code: erc,
            usd: process.env.INIT_USD,
        });

        await newUser.save();
        res.sendStatus(200);
    } catch(err) {
        const message = err?.errors?.email?.properties?.message;
        if (message) return res.status(400).send(message);

        next(err);
    }
});

module.exports = router;