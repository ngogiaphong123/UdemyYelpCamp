const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');
const campgroundController = require('../controllers/campground');
router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn ,validateCampground, catchAsync(campgroundController.createCampground))

router.get('/new',isLoggedIn, campgroundController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isAuthor ,validateCampground ,catchAsync(campgroundController.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgroundController.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgroundController.renderEditForm))

module.exports = router;