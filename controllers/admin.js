const Product=require('../models/product');

exports.getAdminProducts = (req, res, next) => {
        productsList: Product.fetchAll(products => {
            res.render('admin/products-list',{ 
                pageTitle: 'Admin | Products', 
                path: '/admin/products',
                productsList: products
        });
    });
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',{ 
        pageTitle: 'Admin | Add Product', 
        path: '/admin/add-product',
        editing: false
    });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const id = req.params.productId;
    product = Product.findById(id, product => {
        res.render('admin/edit-product',{ 
        pageTitle: 'Admin | Edit Product', 
        path: '/admin/edit-product',
        editing: editMode,
        product: product
    });
    });
}

exports.postAddProduct = (req, res, next) => {
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
    product = new Product (null, title, imageUrl, price, description);
    product.save();
    res.redirect('/');
}

exports.postEditProduct = (req, res, next) => {
    const updatedTitle=req.body.title;
    const updatedImageUrl=req.body.imageUrl;
    const updatedPrice=req.body.price;
    const updatedDescription=req.body.description;
    const productId = req.body.productId;
    product = new Product (productId, updatedTitle, updatedImageUrl, updatedPrice, updatedDescription);
    product.save();
    res.redirect('/');
}

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.deleteById(id);
    res.redirect('/');
}

