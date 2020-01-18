const path = require('path');
const User = require('./models/user')
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoose = require('mongoose')
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/*app.use((req, res, next) => {
  User.findById('5e23069277c5ee2dc852908c')
     .then(user => {
       req.user = new User(user.username, user.email, user.cart, user._id);
       next();
     })
     .catch(err => console.log(err));
});*/

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://aish:2iJTh8WG0guDjasa@nodejs001-we6ex.mongodb.net/test?retryWrites=true&w=majority')
.then(result => {
  app.listen(3000)
})
.catch(err => console.log(err))
