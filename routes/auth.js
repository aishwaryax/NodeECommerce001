const path = require('path')
const authController = require('../controllers/auth')
const express = require('express')
const { check, body } = require('express-validator/check')
const User = require('../models/user')

const router = express.Router()

router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.get('/signup',authController.getSignUp)
router.post('/signup',  [
    check('email').isEmail().normalizeEmail().withMessage('Please enter valid email')
    .custom((val, {req}) =>  {
        return User.findOne({email: val})
                    .then(userDocument => {
                        if (userDocument) {
                            return Promise.reject('Email already exists! Please pick another or log in')
        }
    })
    })
    ,
    body('password').isLength({min: 5, max: 20}).trim().withMessage('Please enter a password between length 5 to 20'),
    body('confirmPassword').custom((val, {req}) => {
        if(val !== req.body.password) {
            throw new Error('Passwords should match!')
            
        }
        return true
    })
    ], authController.postSignUp)
router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)
router.get('/reset/:token', authController.getNewPassword)
router.post('/new-password', authController.postNewPassword)


module.exports = router

