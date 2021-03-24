const request = require('request');
const Coin = require('../models/coin');

setInterval(update, process.env.UPDATE_COINS_INTERVAL);
update();

function update() {
    request(process.env.COINS_URL, (err, res, body) => {
        JSON
        .parse(body)
        .forEach(async coin => {
            coin.current_price = coin.current_price.toFixed(3);
            await Coin.findOneAndUpdate({name: coin.name}, coin, {upsert: true});
        });
    });
}