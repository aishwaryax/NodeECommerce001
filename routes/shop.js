const express = require('express');
const path = require('path');

const adminData = require('../routes/admin');
const rootDir = require('../util/path');

const Router = express.Router();

Router.get('/',(req, res, next) => {

    //console.log(adminData.products)
    //res.sendFile(path.join(rootDir, 'views', 'shop.pug'));
    products = adminData.products
    res.render('shop', {pageTitle: 'Shop', 
                        productsList: products, 
                        path: '/'});

});

module.exports = Router;