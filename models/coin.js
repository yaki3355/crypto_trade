const mongoose = require('mongoose');
const {connection} = require('../db/connection');

const schema = new mongoose.Schema({
    name: String,
    current_price: Number,
    image: String,
    price_change_percentage_24h: Number
});

module.exports = connection.model('Coin', schema);
