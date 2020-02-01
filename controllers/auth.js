const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}))


exports.getLogin = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    }
    else {
        message = null
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message    
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    password = req.body.password
     User.findOne({email: email})
    .then(user => {
        if(!user) {
            req.flash('error','Invalid email.')
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
            req.flash('error','Passwords do not match!')
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
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    }
    else {
        message = null
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        errorMessage: message
    })
}

exports.postSignUp = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    User.findOne({email: email})
    .then(userDocument => {
        if (userDocument) {
            req.flash('error','Email exists already')
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
        .then(result => {
            res.redirect('/login')
            return transporter.sendMail({
                to: email,
                from: 'admin@node-store.com',
                subject: 'Successful sign-up to the Node Store!',
                html: '<h1>Welcome to the Node Store -- your one stop for buying books and much more!</h1>'
            })
        })
        })
    .catch(err => console.log(err))
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    }
    else {
        message = null
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'shop@node-complete.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
