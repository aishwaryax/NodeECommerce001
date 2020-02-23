const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const { validationResult } = require('express-validator/check')


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
                req.session.isLoggedIn = true
                req.session.user = user
                return req.session.save(err => {
                    console.log(err)
                    res.redirect('/')
                })
            }
            req.flash('error','Passwords do not match!')
            return res.redirect('/login')
        })
        .catch(err => {
            console.log(err)
            return res.redirect('/login')
        })
    })
    .catch(err => console.log(err))
}


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
        errorMessage: message,
        oldInput: {email: '', password: '', confirmPassword: ''},
        validationErrors: []
    })
}

exports.postSignUp = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(442).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        errorMessage: errors.array()[0].msg,
        oldInput: {email: email, password: password, confirmPassword: confirmPassword},
        validationErrors: errors.array()
    })
    }
    bcrypt.hash(password, 10)
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
}

exports.getReset = (req, res, next) => {
    console.log("reset called get!")
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
  console.log("post reset called!")
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset')
      console.log("called!")
    }
    const token = buffer.toString('hex')
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
        console.log("called!")
        res.redirect('/')
        return transporter.sendMail({
          to: req.body.email,
          from: 'shop@node-complete.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        })
      })
      .catch(err => {
        console.log(err);
      })
  })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
        let message = req.flash('error')
        if (message.length > 0) {
            message = message[0]
        }
        else {
            message = null
        }
        res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'Update Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token    
    })
    })
    .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken
    let resetUser
    User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
    .then(user => {
        resetUser = user
        return bcrypt.hash(newPassword, 10)
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword
        resetUser.resetToken = undefined
        resetUser.resetTokenExpiration = undefined
        return resetUser.save()
    })
    .then(result => {
        res.redirect('/login')
    })
    .catch()
}
