const User = require('../models/user');

module.exports.renderRegister = async (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = async (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', 'Welcome back');
    res.redirect(redirectUrl);
}

module.exports.logout = async (req, res) => {
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/campgrounds');
}