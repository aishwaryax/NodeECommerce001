const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const mongodbStore = require('connect-mongodb-session')(session)
const multer = require('multer')

const MONGODB_URI = 'mongodb+srv://aish:password@nodejs001-we6ex.mongodb.net/test'

const errorController = require('./controllers/error')

const shopController = require('./controllers/shop')
const isAuth = require('./middleware/is-auth')

const mongoose = require('mongoose')
const csrf = require('csurf')
const flash = require('connect-flash')

const app = express()
const store = new mongodbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const csrfProtection = csrf()


app.set('view engine', 'ejs')
app.set('views', 'views')

const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const User = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }))

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/images/'))

  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-')+'-' + file.originalname)
  }
})

exports.rootPath = __dirname.toString()

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images',express.static(path.join(__dirname, 'images')))

app.use(session({secret: 'my-secret-key', resave: false, saveUninitialized: false, store: store}))



app.use((req, res, next) => {
  if (!req.session.user) {
    next()
  }
  else {
    User.findById(req.session.user._id)
     .then(user => {
       if(!user) {
         return next()
       }
       req.user = user
       next()
     })
     .catch(err => {
       throw new Error(err)
      })
  }
  
})



app.use(flash())

app.use('/admin', adminRoutes)
app.use('/500', errorController.get500)

app.post('/create-order', isAuth, shopController.postOrder)

app.use(csrfProtection)

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  next()
})


app.use(shopRoutes)
app.use(authRoutes)


app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).render('errors/500', { 
    pageTitle: 'Page Not Found', 
    path: '/500', 
    isAuthenticated: req.isLoggedIn 
   })
})

app.use(errorController.get404)

mongoose.connect(MONGODB_URI)
.then(result => {
  app.listen(3000)
})
.catch(err => console.log(err))
