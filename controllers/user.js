const User = require('../models/user');

module.exports.renderRegister = async (req, res) => {
    res.render('users/register');
}

module.exports.userRegister = async (req, res) => {
    try {
        const {username, password, email} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Your account has been registered, Welcome to Yelp Camp');
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

module.exports.userLogin = async (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', 'Welcome back');
    res.redirect(redirectUrl);
}

module.exports.userLogout = async (req, res) => {
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/campgrounds');
}