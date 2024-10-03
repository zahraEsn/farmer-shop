const mongoose = require('mongoose');
require('dotenv').config();
const url = process.env.MONGODB_URL

/* ----- Mongo Connection Class ----- */
const connection = async()=>{
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log('✔ Database Connected');
	} catch (err) {
		console.log('✘ MONGODB ERROR: ', err);
	}
}

module.exports = connection;