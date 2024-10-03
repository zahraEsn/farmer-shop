const Farmers = require('../models/Farmer');
const Users = require('../models/User');
const { ErrorHandler } = require('../helper/errorHandler');
const adminLayout = '../views/layouts/admin.ejs';
require('dotenv').config(); 
const jwt = require('jsonwebtoken'); /* defines a compact and self-contained way for securely transmitting information */
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt'); /* password-hashing function */



class AdminController{
	
	/* ----- Display Admin Panel ----- */
	async adminPanel(req, res){
		try{
			res.render('admin', { title: 'ADMIN', layout: adminLayout });
		}
		catch(error){
			error = new Error('Error Occurred');
			error.statusCode = 500;
			return res.status(error.statusCode).json(new ErrorHandler(error));
		}
	}
	
	/* ----- Validate Admin Username / Password For Login ----- */
	async adminValidation(req, res){
		const { username, password } = req.body;
		const user = await Users.findOne({ username });
	
	
		try{
			if(!user){
				const error = new Error('invalid username or password');
				error.statusCode = 401;
				return res.status(error.statusCode).json(new ErrorHandler(error));
			}
			// const isPasswordValid = await bcrypt.compare(password, user.password);
			if(password !== user.password){
				const error = new Error('invalid username or password');
				error.statusCode = 401;
				return res.status(error.statusCode).json(new ErrorHandler(error));
			}
	
			const token = jwt.sign({ userId: user._id }, jwtSecret);
			res.cookie('token', token, { httpOnly: true });
			res.redirect('/dashboard');
		}
		catch(error){
			error = new Error('Error Occurred');
			error.statusCode = 500;
			return res.status(error.statusCode).json(new ErrorHandler(error));
		}
	}
	
	/* ----- Handling Error & Getting Feedback When Submitting The Form ----- */
	async signUp(req, res){
		try{
			const infoErrorsObj = req.flash('infoErrors');
			const infoSubmitObj = req.flash('infoSubmit');
			res.render('admin/signUp', { title: 'SIGN UP', infoErrorsObj, infoSubmitObj, layout: adminLayout });
		}
		catch(error){
			error = new Error('Error Occurred');
			error.statusCode = 500;
			return res.status(error.statusCode).json(new ErrorHandler(error));
		}
	}
	
	/* ----- Add Farmer & Save On DataBase ----- */
	async signUpNew(req, res){
		try{
			const newFarmer = new Farmers({
				name: req.body.name,
				family: req.body.family, 
				gmail: req.body.gmail, 
				image: req.file.originalname, 
				description: req.body.description,
				products: req.body.products
			})
			await newFarmer.save();
			req.flash('infoSubmit', 'Farmer has been added');
			res.redirect('/signUp');
		}
		catch(error){
			req.flash('infoErrors', error.message || "Error Occurred");
			res.redirect('/signUp');
		}
	}
	
	/* ----- Get Farmers To Display On Dashboard Page ----- */
	async dashboardPage(req, res){
		try{
			const prePage = 10;
			const page = req.query.page || 1;
			const farmers = await Farmers.aggregate([ { $sort: { createdAt: -1 } }])
			.skip(prePage* page - prePage)
			.limit(prePage)
			.exec();
			const count = (await Farmers.find()).length;
			const nextPage = parseInt(page) + 1;
			const hasNextPage = nextPage <= Math.ceil(count / prePage);
	
			res.render('admin/dashboard', { 
				title: 'DASHBOARD',
				layout: adminLayout,
				farmers,
				current: page,
				nextPage: hasNextPage? nextPage : null
			});
		}catch(error){
			error = new Error('Error Occurred');
			error.statusCode = 500;
			return res.status(error.statusCode).json(new ErrorHandler(error));
		}
	}
	
	/* ----- Get Farmers Info To Edit ----- */
	async editPage(req, res){
		try{
			const farmer = await Farmers.findById({ _id: req.params.id });
			res.render('admin/edit', {
				farmer,
				layout: adminLayout
			})
		}
		catch(error){
			error = new Error('Error Occurred');
			error.statusCode = 500;
			return res.status(error.statusCode).json(new ErrorHandler(error));
		}
	}
	
	/* ----- Post Farmers Edited Info ----- */
	async editInfo(req, res){
		try{
			await Farmers.findByIdAndUpdate(req.params.id, {
				name: req.body.name,
				family: req.body.family, 
				gmail: req.body.gmail, 
				// image: req.body.image, 
				description: req.body.description,
				products: req.body.products,
				updatedAt: Date.now()
			});
			res.redirect('/dashboard');
		}
		catch(error){
			error = new Error('you are not be able to edit item');
			error.statusCode = 403;
			return res.status(error.statusCode).json(new ErrorHandler(error));
		}
	}
	
	/* ----- Delete Farmer By Its ID ----- */
	async deleteInfo(req, res){
		try{
			await Farmers.deleteOne({ _id: req.params.id });
			res.redirect('/dashboard');
		}
		catch(error){
			error = new Error('you are not be able to delete item');
			error.statusCode = 403;
			return res.status(error.statusCode).json(new ErrorHandler(error));
		}
	}
	
	/* ----- Logout From Admin Page ----- */
	async logOut(req, res){
		res.clearCookie('token');
		res.redirect('/');
	}
}

module.exports = { AdminController: new AdminController() } 