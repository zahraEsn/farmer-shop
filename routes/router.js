const express = require('express');
const router = express.Router();
const { ErrorHandler } = require('../helper/errorHandler');
const { userRoute } = require('./user');
const { adminRoute } = require('./admin');


router.use('/', userRoute);
router.use('/', adminRoute);

/* ----- if No route matches send user a 404 page ----- */
router.use('/*', (req, res) => {
	const error = new Error('Requested path does not exist.');
	error.statusCode = 404;
	res.status(error.statusCode).json(new ErrorHandler(error));
});



module.exports = { AllRoutes: router };