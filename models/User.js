const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: "in this field username is required",
		unique: true
	},
	password: {
		type: String,
		required: "in this field password is required",
	},
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);