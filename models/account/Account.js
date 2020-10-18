const mongoose = require('mongoose');

const Account = new mongoose.Schema({
	email: {type: String, required: true},
	name: {type: String},
	age: {type: Number},

}, {timestamps: true});

module.exports = mongoose.model('Account', Account);
