const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers/UserController');



/* ----- Users Routes ----- */

router.get('/', UserController.homePage);
router.get('/products', UserController.products);
router.get('/farmers', UserController.farmers);
router.get('/farmers/:id', UserController.farmerDetail);
router.post('/search', UserController.searchFarmer);



module.exports = { userRoute: router };