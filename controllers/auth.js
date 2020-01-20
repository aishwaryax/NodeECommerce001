User = require('../models/user')
bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    password = req.body.password
     User.findOne({email: email})
    .then(user => {
        if(!user) {
            return res.redirect('/login')
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            return res.redirect('/login')
        })
        .catch(err => {
            console.log(err)
            return res.redirect('/login')
        })
    })
    .catch(err => console.log(err));
};


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        return res.redirect('/') 
    })
}

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        isAuthenticated: false
    })
}

exports.postSignUp = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    User.findOne({email: email})
    .then(userDocument => {
        if (userDocument) {
            return res.redirect('/signup')
        }
        return bcrypt.hash(password, 10)
        .then(hashedPassword => {
            const user = new User({
            email: email,
            password: hashedPassword,
            cart: {items: []}
        })
         user.save()
        })
        })
    .then(result => {
            return res.redirect('/login')
    })
    .catch(err => console.log(err))
}