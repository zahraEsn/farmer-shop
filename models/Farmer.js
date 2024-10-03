const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const farmerSchema = new Schema({
	name: {
		type: String,
		required: "in this field name is required"
	},
	family: {
		type: String,
		required: "in this field family is required"
	},
	gmail: {
		type: String,
		required: "in this field gmail is required"
	},
	image: {
		type: String,
		required: false
	},
	products: {
		type: Object,
		enum: ['fruit', 'dairy', 'fatsoils', 'vegetables', 'condiments', 'sweets'],
		required: false
	},
	description: {
		type: String,
		required: false
	},
}, {timestamps: true})

farmerSchema.index({ name: 'text', description: 'text'});

module.exports = mongoose.model('Farmer', farmerSchema);