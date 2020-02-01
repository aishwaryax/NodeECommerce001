const path = require('path');
const authController = require('../controllers/auth')
const express = require('express');

const router = express.Router();

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.get('/signup', authController.getSignUp)
router.post('/signup', authController.postSignUp)
router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)


module.exports = router

