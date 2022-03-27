const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const reviewController = require('../controllers/review');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');
router.post('/', isLoggedIn ,validateReview ,catchAsync(reviewController.createReview));
// Delete route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviewController.deleteReview));
module.exports = router;