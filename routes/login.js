const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/login', async (req, res, next) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({username});

        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).send('Invalid username or password');

        const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

        res.json({
            token,
            email: user.email
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;