const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  imageUrl: String
})




/*const getDb = require('../util/database').getDb;
const mongoDb = require('mongodb');

class Product {
  constructor(title, price, description, imageUrl, _id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = _id ? new mongoDb.ObjectId (_id) : null;
    this.userId = userId
  };

  save() {
    const db = getDb();
    let operation;
    if (this._id) {
      operation=db.collection('products').updateOne({_id: this._id}, {$set: this});
    }

    else {
      operation=db.collection('products').insertOne(this);
      console.log("udhar")
    }
    return operation
      .then(result => {
        console.log("ummmm",result);
      })
      .catch(err => {
        console.log(err);
      });
  };

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  };

  static findById (prodId)
  {
    const db = getDb();
    return db.collection('products').find({_id: new mongoDb.ObjectId(prodId)}).next()
              .then(product => {
                return product;
              })
              .catch(err => {
        console.log(err);
      });
  };

  static deleteById (prodId) {
    const db = getDb();
    return db.collection('products').deleteOne({_id: new mongoDb.ObjectId(prodId)})
              .then((result) => {
                console.log(result);
              })
              .catch(err => {
                console.log(err);
              });
  }
}*/

module.exports = mongoose.model('Product',productSchema)
