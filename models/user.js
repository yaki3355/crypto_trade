const mongoose = require('mongoose');
const {isEmail} = require('validator');
const {connection} = require('../db/connection');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {validator: isEmail, message: 'Invalid email'}
    },
    password: {
        type: String,
        required: true
    },
    email_reset_code: {
        type: String
    },
    usd: {
        type: Number
    },
    coins: {
        type: Object,
        default: {}
    }
}, {minimize: false});

module.exports = connection.model('User', schema);
