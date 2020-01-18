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

app.use((req, res, next) => {
  User.findById('5e233ae5c0055f5da898b191')
     .then(user => {
       req.user = user;
       next();
     })
     .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://aish:2iJTh8WG0guDjasa@nodejs001-we6ex.mongodb.net/test?retryWrites=true&w=majority')
.then(result => {
  User.findOne().
  then(user => {
    if(!user) {
      const user = new User({
      name: 'ash',
      email: 'aishwaryas@gmail.com',
      cart: {items: []}
      })
      user.save()
    }
  })
  
  app.listen(3000)
})
.catch(err => console.log(err))
