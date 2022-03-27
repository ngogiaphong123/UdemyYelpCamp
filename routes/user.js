const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user');
// Register
router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync(userController.userRegister))
// Login
router.route('/login')
    .get(userController.renderLogin)
    .post(passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), userController.userLogin);
// Logout
router.get('/logout', userController.userLogout)
module.exports = router;