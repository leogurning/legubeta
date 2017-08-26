var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var User = require('../models/user');
var passport = require('passport');
var moment = require('moment');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedin, function(req, res, next){
    res.render('user/profile', {csrfToken: req.csrfToken(), username: req.user.pusername, pdate: moment().format('MMMM Do YYYY, h:mm:ss a')});
});

router.get('/modifyUser', isLoggedin, function(req, res, next){
    var messages = req.flash('error');
    res.render('user/modifyUser', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/modifyUser', isLoggedin, function(req, res, next) {
    var messages = [];
    var vuserid = req.body.InputUserId;
    var vusername = req.body.InputUserName;
    //var rgxuserid = '\.*'+vuserid+'\.';
    //var rgxusername = '\.*'+vusername+'\.';
    User.find({'puserid': new RegExp(vuserid, 'i'), 'pusername': new RegExp(vusername, 'i')}, function(err, docs){
        if (err) {
            messages.push(err.msg);
        }
        res.render('user/modifyUser', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, users: docs});
    });
});

router.get('/logout', isLoggedin, function(req, res, next){
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedin, function(req,res,next){
    next();
});

router.get('/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', function(req, res, next){
   var vUserId = req.body.puserid;
   var vUserName = req.body.pusername;
   var vRole = req.body.prole;
   var vDept = req.body.pdept;
   var vPasswd = req.body.ppassword;
   var messages = [];

   req.checkBody('puserid','Missing UserId information').notEmpty();
   req.checkBody('puserid','Invalid UserId. It must be min 4 chars').isLength({min:4});
   req.checkBody('pusername','Missing Username information').notEmpty();
   req.checkBody('prole','Missing Role information').notEmpty();
   req.checkBody('pdept','Missing Dept information').notEmpty();
   req.checkBody('ppassword','Missing Password information').notEmpty();
   req.checkBody('ppassword','Invalid Password. It must be min 4 chars').isLength({min:4});

   var errors = req.validationErrors();

   if (errors){
       messages = [];
       errors.forEach(function(error) {
           messages.push(error.msg);
       });
       res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
   }else {
       User.findOne({'puserid': vUserId}, function (err, user) {
           messages = [];
           if (err) {
               messages.push(err.msg);
               res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
           }else {
               if (user) {
                   messages.push('User ID already exists !');
                   res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});

               }else {
                   var newUser = new User({
                       puserid: vUserId,
                       pusername: vUserName,
                       prole: vRole,
                       pdept: vDept,
                       ppassword: vPasswd
                   });
                   User.createUser(newUser, function (err, user) {
                       if (err) throw err;
                       console.log(user);
                   });
                   res.render('user/signin', {csrfToken: req.csrfToken(), message: 'You are registered and can now Sign In.'});
               }
           }
       });
   }
});

router.get('/signin', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));


module.exports = router;

function isLoggedin (req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedin (req, res, next) {
    if (!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
