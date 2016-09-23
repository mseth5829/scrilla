var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();
var methodOverride = require('method-override');
var isLoggedIn = require('../middleware/isLoggedIn');


router.use(methodOverride('_method'));

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res) {
  var email = req.body.email;
  var name = req.body.name;
  var password = req.body.password;

  db.user.findOrCreate({
    where: { email: email },
    defaults: {
      name: name,
      password: password
    }
  }).spread(function(user, created) {
    if (created) {
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in'
      })(req, res);
    } else {
      req.flash('error', 'Email already exists');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    req.flash('error', error.message);
    res.redirect('/auth/signup');
  });
});

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have logged in'
}));

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

router.get("/update", isLoggedIn, function(req, res) {
  res.render('auth/update')
});

// UPDATE (this route accept info from the HTML form)
router.put("/update", function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  db.user.find(
    {where: {email: email}
    }).then(function(user){
     user.update({
       name: name,
       email: email,
       password: password
     }).then(function() {
       req.flash('success', 'Update was successful');
       res.redirect('/auth/update');
     }).catch(function (error){
       req.flash('error', 'Unfortunately something went wrong with the update');
       res.redirect('/auth/update');
     });
  })
});




// router.get('/profile', function(req,res){
//   db.user.findOne().then(function(user) {
//     user.getScenarios().then(function(scenarios) {
//       console.log(scenarios)
//     });
//   });
//
//
//   // db.user.findById(req.user.id).then(function(user) {
//   //   user.getScenarios().then(function(scenarios) {
//   //     // console.log(scenarios)
//   //   });
//   // });
//   // res.render('auth/profile', {scenarios: scenarios})
// })

module.exports = router;
