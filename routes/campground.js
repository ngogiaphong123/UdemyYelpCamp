const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schema');
const flash = require('connect-flash');
const {isLoggedIn} = require('../middleware');
const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}))
// Create create route
router.get('/new',isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
})
router.post('/',isLoggedIn ,validateCampground, catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError("Invalid campground data.",400);
    const campground = await Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Create show route
router.get('/:id' ,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", {campground});
}))
//Create update route
router.get('/:id/edit',isLoggedIn,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", {campground});
}))
router.put('/:id',isLoggedIn, validateCampground ,catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, {new : true});
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
//Create delete route
router.delete('/:id',isLoggedIn,catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))

module.exports = router;