const express = require('express');
const router = express.Router();
const { AdminController } = require('../controllers/adminController');
const authFarmer = require('../middlewares/authentication');
const multer = require('multer'); /* module designed for Node.js */
const storage = multer.diskStorage({
	destination: (req, file, cb)=>{
		return cb(null, './public/uploads')
	},
	filename: (req, file, cb)=>{
		return cb(null, file.originalname)
	},
});
const upload = multer({ storage });



/* ----- Admin Routes ----- */

router.get('/admin', AdminController.adminPanel);
router.post('/admin', AdminController.adminValidation);
router.get('/dashboard', authFarmer, AdminController.dashboardPage);
router.get('/signUp', authFarmer, AdminController.signUp);
router.post('/signUp', upload.single('image'), authFarmer, AdminController.signUpNew);
router.get('/edit/:id', authFarmer, AdminController.editPage);
router.put('/edit/:id', upload.single('image'), authFarmer, AdminController.editInfo)
router.delete('/delete/:id', AdminController.deleteInfo);
router.get('/logout', AdminController.logOut);



module.exports = { adminRoute: router };