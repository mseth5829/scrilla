var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var app = express();
var path = require('path');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var db = require('./models');

app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, 'public')));


app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'tacocat',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

app.use( function(req, res, next) {
  if(req.session.passport){
    res.locals.currentUser = req.session.passport.user
  }
  next()
});

//Getting db available company data for use in Scenario Manager
var companyNames = [];
var companyTickers = [];
db.ticker.findAll().then(function(tickers){
  for(var i = 0; i<tickers.length; i++){
    companyNames.push(tickers[i].dataValues.name);
    companyTickers.push(tickers[i].dataValues.ticker);
  };
});


app.get('/', function(req, res) {
  res.render('index');
});

app.get('/scenario-manager', isLoggedIn, function(req, res) {
  res.render('scenario-manager', {companyNames: companyNames, companyTickers: companyTickers} )
});

app.use('/auth', require('./controllers/auth'));

var server = app.listen(3000);

module.exports = server;
