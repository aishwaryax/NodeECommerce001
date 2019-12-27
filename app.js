const express=require('express');
const bodyParser=require('body-parser');
const path = require('path');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app=express();

//app.set('view engine', 'pug');
//app.set('views', 'views');

app.set('view engine', 'ejs');
app.set('views', 'views');

//const expressHbs = require('express-handlebars');
//app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}));
//app.set('view engine', 'hbs');
//app.set('views', 'views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);

app.use(shopRoutes);

app.use((req, res) => {

    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));


});

app.listen(3000);