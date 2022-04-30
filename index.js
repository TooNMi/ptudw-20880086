let express = require('express');
let app = express();


//Set public static folder
app.use(express.static(__dirname + '/public'));

//Use view engine
let expressHbs = require('express-handlebars');
let helper = require('./controllers/helper');
let hbs = expressHbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  helpers: {
    createStarList: helper.createStarList,
    createStars: helper.createStars
  }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//Set up routes
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));

//Route for pages with banner
app.get('/:page', (req, res) => {
  let banners = {
    blog: 'Out Blog',
    category: 'Shop Category',
    cart: 'Shopping Cart',
    checkout: 'Product Checkout',
    confirmation: 'Order Confirmation',
    contact: 'Contact Us',
    login: 'Login / Register',
    register: 'Register', 
    'single-blog': 'Blog Details',
    'single-product': 'Shop Single',
    'tracking-order': 'Order Tracking'
  }
  let page = req.params.page;
  console.log(banners[page]);
  res.render(page, {banner: banners[page]});
})

//Sync database
app.get('/sync', (req, res) => {
  let models = require('./models');

  console.log('Trying to connect to DB...')

  models.sequelize.sync().then(() => {
    res.send('Database sync completed!');
  }).catch((err) => {
    console.log(err);
  });
});

app.get('/sync', (req, res) => {
  let models = require('./models');

  console.log('Trying to connect to DB...')

  models.sequelize.sync()
  .then(() => {
    res.send('Databased synced!')
  })
  .catch((error) => {
    console.log(error);
  });
});

//Fix ico module missing
app.use( function(req, res, next) {

  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }

  return next();

});




//Set server port and start server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
  console.log(`Server is running at port ${app.get('port')}`);
});