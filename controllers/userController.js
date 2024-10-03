const Products = require('../models/Product');
const Farmers = require('../models/Farmer');
const { ErrorHandler } = require('../helper/errorHandler');



class UserController{

	/* ----- Get Objects To Display On Home Page ----- */
	async homePage(req, res){
		try{
			const prePage = 4;
			const page = req.query.page || 1;
			const farmers = await Farmers.aggregate([ { $sort: { createdAt: -1 } }])
			.skip(prePage* page - prePage)
			.limit(prePage)
			.exec();
			const count = (await Farmers.find()).length;
			const nextPage = parseInt(page) + 1;
			const hasNextPage = nextPage <= Math.ceil(count / prePage);
			
			const products = await Products.find({}).limit(6);
	
			res.render('index', { title: 'HOME',
				products, 
				farmers,
				current: page,
				nextPage: hasNextPage? nextPage : null
			});
		}
		catch(error){
			error = new Error('Error Occurred');
			error.statusCode = 500;
			return res.status(error.statusCode).json(new ErrorHandler(error));	
		}
	}
	
	/* ----- Get Products To Display On Products Page ----- */
	async products(req, res){
		try{
			const products = await Products.find({});
			res.render('products', { title: 'PRODUCTS', products });
		}
		catch(error){
			error = new Error('Error Occurred');
			error.statusCode = 500;
			return res.status(error.statusCode).json(new ErrorHandler(error));
		}
	}
	
	/* ----- Get Farmers To Display On Farmers Page ----- */
	async farmers(req, res){
		try{
			const farmers = await Farmers.find({});
			res.render('farmers', { title: 'FARMERS', farmers });
		}
		catch(error){
			error = new Error('Error Occurred');
			error.statusCode = 500;
			return res.status(error.statusCode).json(new ErrorHandler(error));
		}
	}
	
	/* ----- Get All Info About Farmer With Its ID To Display ----- */
	async farmerDetail(req, res){
		try{
			let farmerID = req.params.id;
			const farmer = await Farmers.findById({ _id: farmerID });
			res.render('farmerDetail', { title: 'FARMER DETAIL', farmer });
		}
		catch(error){
			error = new Error('Error Occurred');
			error.statusCode = 500;
			return res.status(error.statusCode).json(new ErrorHandler(error));
		}
	}
	
	/* ----- Search For Farmer By Name Or Description ----- */
	async searchFarmer(req, res){
		try{
			let searchItem = req.body.searchItem;
			let searchNoSpacialChar = searchItem.replace(/[^a-zA-Z0-9]/g, "")
			let farmers = await Farmers.find({ 
				$or: [
					{ name: { $regex: new RegExp(searchNoSpacialChar, 'i') } },
					{ body: { $regex: new RegExp(searchNoSpacialChar, 'i') } },
				]
			});
			res.render('search', { title: 'SEARCH', farmers})
		}
		catch(error){
			error = new Error('Error Occurred');
			error.statusCode = 500;
			return res.status(error.statusCode).json(new ErrorHandler(error));
		}
	}
}



/* ----- Farmer Sample ----- */

// const inse = async(){
// 	try{
// 		await Farmers.insertMany([
// 			{name: 'Oscar', family: 'Thomas', gmail: 'Oscar@gamil.com', image: 'f1.png',
// 				products: ['fruit', 'dairy'],
// 				description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, voluptas. Inventore provident ullam odit similique iste illum harum vel, exercitationem saepe? Accusamus et nobis nihil error ipsam exercitationem eligendi laboriosam.'},
// 			{name: 'Bob', family: 'Bernard', gmail: 'Bob@gamil.com', image: 'f2.png',
// 				products: ['condiments', 'fruit', 'fatsoils', 'sweets'],
// 				description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, voluptas. Inventore provident ullam odit similique iste illum harum vel, exercitationem saepe? Accusamus et nobis nihil error ipsam exercitationem eligendi laboriosam.'},
// 			{name: 'John', family: 'Guzman', gmail: 'John@gamil.com', image: 'f3.png',
// 				products: ['sweets', 'vegetables', 'fruit'],
// 				description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, voluptas. Inventore provident ullam odit similique iste illum harum vel, exercitationem saepe? Accusamus et nobis nihil error ipsam exercitationem eligendi laboriosam.'},
// 			{name: 'Musa', family: 'Medrano', gmail: 'Musa@gamil.com', image: 'f4.png',
// 				products: ['fatsoils', 'vegetables'],
// 				description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, voluptas. Inventore provident ullam odit similique iste illum harum vel, exercitationem saepe? Accusamus et nobis nihil error ipsam exercitationem eligendi laboriosam.'},
// 		])
// 	}
// 	catch(error){
// 		console.log(error);
// 	}
// }
// insertFarmer();



/* ----- Product Sample ----- */

// const inser = async(){
// 	try{
// 		await Products.insertMany([
// 			{title: 'Fruit', image: 'fruits.svg'},
// 			{title: 'Dairy', image: 'dairy.svg'},
// 			{title: 'Fats and Oils', image: 'fatsoils.svg'},
// 			{title: 'Vegetables', image: 'vegetables.svg'},
// 			{title: 'Condiments', image: 'condiments.svg'},
// 			{title: 'Sweets', image: 'sweets.svg'},
// 		])
// 	}
// 	catch(error){
// 		console.log(error);
// 	}
// }
// insertProduct();



module.exports = { UserController: new UserController() } 