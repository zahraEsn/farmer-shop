const express = require('express');
const app = express();
const { AllRoutes } = require('./routes/router.js')
const expressLayouts = require('express-ejs-layouts'); /* server side layouts with ejs templates */
const helmet = require('helmet'); /* for security */
const methodOverride = require('method-override');  /* subclass to provide a specific implementation of a method that is already provided by one of its superclasses */
const session = require('express-session'); /* temporarily stores important information about a current user's session */
const cookieParser = require('cookie-parser'); /* simplifies handling cookies */
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); /* render a pop-up message  */
const port = process.env.PORT || 3000;
require('dotenv').config(); /* an npm JavaScript package that loads environment variables from */



/* ----- Process app On All This Requests  ----- */
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(helmet());
app.set('layout', './layouts/main.ejs'); /* sets main template engine */
app.set('view engine', 'ejs'); /* sets view engine to ejs */
app.use(cookieParser('CookingBlogSecure'));
app.use(session({
	secret: 'geeksforgeeks',
	saveUninitialized: true,
	resave: false,
	store: MongoStore.create({
		mongoUrl: process.env.MONGODB_URL
	})
}));
app.use(flash());
app.use(methodOverride('_method'));

/* ----- Setting Up Routes ----- */
app.use('/', AllRoutes);

/* ----- Running Server ----- */
app.listen(port, ()=>{
	try{
		console.log(`✔ Server Running On http://localhost:${port}`);
		console.log('✔ Application Started');
	}catch(err){
		console.log('✘ Application failed to start');
		console.error('✘', err);
	}
})

/* ----- Initialize DB Connection ----- */
const connection = require('./config/db.js');
connection();