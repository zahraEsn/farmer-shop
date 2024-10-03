const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	title: {
		type: String,
		required: "in this field title is required"
	},
	image: {
		type: String,
		required: "in this field image is required"
	},
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema);