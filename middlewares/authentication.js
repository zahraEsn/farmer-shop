require('dotenv').config();
const jwt = require('jsonwebtoken'); /* defines a compact and self-contained way for securely transmitting information */
const jwtSecret = process.env.JWT_SECRET;


/* ----- Authentication For Admin ----- */
module.exports = authFarmer = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const decoded = jwt.verify(token, jwtSecret);
		req.userId = decoded.userId;
		next();
	}
	catch (error) {
		res.status(401).json({ message: 'Unauthorized' })
	}
}

