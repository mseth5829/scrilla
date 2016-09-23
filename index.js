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
    res.locals.userNow = req.user
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

app.post('/scn', function(req,res){
  var name = req.body.name;
  var ticker = req.body.ticker;
  var ebitdaArray = req.body.ebitdaArray;
  var waccArray = req.body.waccArray;
  var grArray = req.body.grArray;
  var finalYearEbitda = req.body.finalYearEbitda;
  var finalYearUFCF = req.body.finalYearUFCF;
  var ebitdaMultiple = req.body.ebitdaMultiple;
  var perpetuityGrowthRate = req.body.perpetuityGrowthRate;
  var pvEbitdaMethod = req.body.pvEbitdaMethod;
  var evForEbitdaMethod = req.body.evForEbitdaMethod;
  var terminalPerpetuityValue = req.body.terminalPerpetuityValue;
  var pvPerpetuityMethod = req.body.pvPerpetuityMethod;
  var evForPerpetuityMethod = req.body.evForPerpetuityMethod;
  var totalPV = req.body.totalPV;
  db.user.findById(req.user.id).then(function(user) {
    user.createScenario({
      name: name,
      ticker: ticker,
      ebitdaArray: ebitdaArray,
      waccArray: waccArray,
      grArray: grArray,
      finalYearEbitda: finalYearEbitda,
      finalYearUFCF: finalYearUFCF,
      ebitdaMultiple: ebitdaMultiple,
      perpetuityGrowthRate: perpetuityGrowthRate,
      pvEbitdaMethod: pvEbitdaMethod,
      evForEbitdaMethod: evForEbitdaMethod,
      terminalPerpetuityValue: terminalPerpetuityValue,
      pvPerpetuityMethod: pvPerpetuityMethod,
      evForPerpetuityMethod: evForPerpetuityMethod,
      totalPV: totalPV
    }).then(function(scenario) {
      console.log(scenario.get());
    });
  });
  res.json( {redirectTo: '/'} )
})


var server = app.listen(process.env.PORT || 3000);

module.exports = server;
