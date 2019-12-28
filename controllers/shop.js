const Product=require('../models/product');
const Cart = require('../models/cart')

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/products-list', {
            pageTitle: 'Shop', 
            productsList: products, 
            path: '/'});
    });
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/products-list', {
            pageTitle: 'Shop', 
            productsList: products, 
            path: '/products'});
    });
}

exports.getProductDetails = (req, res, next) => {
    Product.fetchAll(products => {
        const productId = req.params.productId;
    /*    res.render('shop/products-list', {
            pageTitle: 'Shop', 
            productsList: products, 
            path: '/products'});*/
        Product.findById(productId, product=> {
            Cart.addProduct(productId, product.price)
        });
    });
    
}

exports.getCart = (req, res, next) => {
    
    res.render('shop/cart', {
        pageTitle: 'Cart', 
        path: '/cart'
    });
}
exports.postCart = (req, res, next) => {

    const productId = req.body.productId;
    Product.findById(productId, product=> {
            Cart.addProduct(product.id, product.price);
        });
    res.redirect("/cart");
    
    /*res.render('shop/cart', {
        pageTitle: 'Cart', 
        path: '/cart'
    });*/
}

exports.getCheckout = (req, res, next) => {
    
    res.render('shop/checkouts', {
        pageTitle: 'Cart', 
        path: '/cart'
    });
}
