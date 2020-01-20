const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const mongodbStore = require('connect-mongodb-session')(session)

const MONGODB_URI = 'mongodb+srv://aish:2iJTh8WG0guDjasa@nodejs001-we6ex.mongodb.net/test'

const errorController = require('./controllers/error')
const mongoose = require('mongoose')
const app = express()
const store = new mongodbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')

const User = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: 'my-secret-key', resave: false, saveUninitialized: false, store: store}))

app.use((req, res, next) => {
  if (!req.session.user) {
    next()
  }
  else {
    User.findById(req.session.user._id)
     .then(user => {
       req.user = user
       next()
     })
     .catch(err => console.log(err))
  }
  
});

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
.then(result => {
  app.listen(3000)
})
.catch(err => console.log(err))
