const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const {authorization} = req.headers;
    const token = authorization?.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        req.username = user.username;
        next();
    });
}

function randStr() {
    return Math.random().toString(36).substring(7);
}

module.exports = {
    auth,
    randStr
};