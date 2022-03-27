const express = require('express');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const {campgroundSchema , reviewSchema} = require('./schema');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const campgrounds = require('./routes/campground');
const reviews = require('./routes/review');
const path = require('path');
const session = require('express-session');
const app = express();
const flash = require('connect-flash');
//Mongoose connection
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open", () => console.log("Connected to DB!"));
// App.use and app.set
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));
// Session setup
const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
// connect-flash setup
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
// Main routes
app.get('/', (req, res) => {
    res.render("home");
})
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews);
// Error handler middleware
app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found.", 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Something went wrong."
    res.status(statusCode).render('campgrounds/error', { err });
})
app.listen(3000, () => {
    console.log('listening on 3000');
})