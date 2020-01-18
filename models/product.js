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
  imageUrl: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true}
})

module.exports = mongoose.model('Product',productSchema)
