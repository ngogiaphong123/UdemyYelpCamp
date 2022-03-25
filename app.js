const express = require('express');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const {campgroundSchema} = require('./schema');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const app = express();
const path = require('path');
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open", () => console.log("Connected to DB!"));

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}
app.get('/', (req, res) => {
    res.render("home");
})
// Crete index route
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}))
// Create create route
app.get('/campgrounds/new', (req, res) => {
    res.render("campgrounds/new");
})
app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError("Invalid campground data.",400);
    const campground = await Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Create show route
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", {campground});
}))
//Create update route
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", {campground});
}))
app.put('/campgrounds/:id', validateCampground ,catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, {new : true});
    res.redirect(`/campgrounds/${campground._id}`);
}))
//Create delete route
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}))
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