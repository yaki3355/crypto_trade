const router = require('express').Router();
const User = require('../models/user');
const Coin = require('../models/coin');
const {auth} = require('../utils');
const user = require('../models/user');

router.get('/my_property', auth, async (req, res, next) => {
    try {
        const {usd, coins} = await User.findOne({username: req.username});

        res.json({
            usd,
            coins
        });
    } catch(err) {
        next(err);
    }
});

router.put('/buy', auth, async (req, res, next) => {
    const name = req.body.name;
    const num = +req.body.num;

    if (!num) return res.status(400).send('Invalid num'); 

    try {
        const coin = await Coin.findOne({name});
        
        if (!coin) return res.status(400).send('Coin not exists');
        
        const user = await User.findOne({username: req.username});
        const price = coin.current_price * num;

        if (price > user.usd) return res.status(400).send('User can not afford');

        await user.updateOne({usd: toFixed(user.usd - price), [`coins.${name}`]: toFixed(user.coins[name] + num || num)});
        res.sendStatus(200);
    } catch(err) {
        next(err);
    }
});

router.put('/sell', auth, async (req, res, next) => {
    const name = req.body.name;
    const num = +req.body.num;

    if (!num) return res.status(400).send('Invalid num'); 

    try {
        const coin = await Coin.findOne({name});
        
        if (!coin) return res.status(400).send('Coin not exists');

        const user = await User.findOne({username: req.username});
        const userCoinNum = user.coins[name];

        if (!userCoinNum || userCoinNum < num) return res.status(400).send(`User does not have ${num} ${name}`);

        await user.updateOne({usd: toFixed(user.usd + coin.current_price * num), [`coins.${name}`]: toFixed(userCoinNum - num)});
        res.sendStatus(200);
    } catch(err) {
        next(err);
    }
});

router.get('/coins_data', auth, async (req, res, next) => {
    try {
        const coins = await Coin.find({}, {_id: 0, __v: 0});

        res.json({
            coins
        });
    } catch(err) {
        next(err);
    }
});

router.get('/users_total_balance', auth, async (req, res, next) => {
    try {
        const coinsData = (await Coin.find({})).reduce((o, c) => {o[c.name] = c.current_price; return o;}, {});
        const users = await User.find({}).select({username: 1, usd: 1, coins: 1}).lean();
        const arr = users.map(u => ({username: u.username, totalBalance: toFixed(u.usd + coinsToUsd(u.coins, coinsData))}));

        res.json({
            users: arr
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;

function coinsToUsd(userCoins, coinsData) {
    return Object.keys(userCoins).reduce((sum, k) => {
        return sum + userCoins[k] * coinsData[k];
    }, 0);
}

function toFixed(n) {
    return +n.toFixed(3);
}