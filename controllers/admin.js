const Product = require('../models/product')
const mongoDb = require('mongodb')
const ObjectId  = mongoDb.ObjectId
const { validationResult } = require('express-validator/check')
const path = require('path')
const app = require('../app')

const fileHelper = require('../util/file')


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const image = req.file
  const price = req.body.price
  const description = req.body.description
  const errors = validationResult(req)

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: image,
        price: price,
        description: description
      },
      errorMessage: 'Attached file is not an image',
      validationErrors: []
    })

  }

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: image,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    })
  }



  var imageUrl = image.path

  imageUrl = imageUrl.substring(imageUrl.search('images'),imageUrl.length)

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  })
  product
    .save()
    .then(result => {
      console.log('Created Product')
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
  }


 exports.getEditProduct = (req, res, next) => {
   const editMode = req.query.edit
   if (!editMode) {
     return res.redirect('/admin/add-product')
   }
   const prodId = req.params.productId
     Product.findById(prodId)
     .then(product => {
       if (!product) {
         return res.redirect('/')
       }
       res.render('admin/edit-product', {
         pageTitle: 'Edit Product',
         path: '/admin/edit-product',
         editing: editMode,
         product: product,
         isAuthenticated: req.isLoggedIn
       })
     })
     .catch(err => console.log(err))
 }

 exports.postEditProduct = (req, res, next) => {
   const prodId = req.body.productId
   const updatedTitle = req.body.title
   const updatedPrice = req.body.price
   const updatedImage = req.file
   const updatedDesc = req.body.description
   Product.findById(prodId).then(product => {
     if(product.userId.toString() != req.user._id.toString()) {
         return res.redirect('/')
       }
       product.title = updatedTitle
       product.price = updatedPrice
       var imageUrl = updatedImage.path
       if(updatedImage) {
         fileHelper.deleteFile(path.resolve(app.rootPath, product.imageUrl))
         product.imageUrl = imageUrl.substring(imageUrl.search('images'),imageUrl.length)
       }
       product.description = updatedDesc
       return product.save()
       .then(result => {
        res.redirect('/admin/products')
    })
   })
    .catch(err => console.log(err))
 }

 exports.getProducts = (req, res, next) => {
   Product.find({userId: req.user._id})
     .then(products => {
       return res.render('admin/products', {
         prods: products,
         pageTitle: 'Admin Products',
         path: '/admin/products',
         isAuthenticated: req.session.isLoggedIn
       })
     })
     .catch(err => console.log(err))
 }

 exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'))
      }
      fileHelper.deleteFile(path.resolve(app.rootPath, product.imageUrl))
      return Product.deleteOne({ _id: prodId, userId: req.user._id })
    })
    .then(() => {
      res.status(200).json({message: 'success'})
    })
    .catch(err => {
      return res.status(500).json({message: 'failure'})
    })
}

