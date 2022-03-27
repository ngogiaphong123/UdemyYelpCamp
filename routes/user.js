const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const passport = require('passport');
router.get('/register', async (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async (req, res) => {
    try {
        const {username, password, email} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Your account has been registered, Welcome to yelpcamp');
            return res.redirect('/campgrounds');
        })
    } catch(err) {
        req.flash('error', err.message);
        return res.redirect('/register');
    }   
}))
router.get('/login', async (req, res) => {
    res.render('users/login');
})
router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), async (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', 'Welcome back');
    res.redirect(redirectUrl);
})
router.get('/logout', async (req, res) => {
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/campgrounds');
})
module.exports = router;