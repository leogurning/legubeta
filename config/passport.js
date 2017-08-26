var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local-signin', new LocalStrategy({
    usernameField: 'puserid',
    passwordField: 'ppassword',
    passReqToCallback: true
}, function(req, puserid, ppassword, done) {
    req.checkBody('puserid','Invalid User ID').notEmpty();
    req.checkBody('ppassword','Invalid Password').notEmpty();
    var errors = req.validationErrors();
    if (errors){
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'puserid': puserid }, function(err, user){
    if (err) {
        return done(err);
    }
    if (!user) {
        return done(null, false, {message: 'No user found !'});
    }
    if (!user.validPassword(ppassword)) {
        return done(null, false, {message: 'Invalid password !'});
    }
    //userId = puserid;
    //userName = user.pusername;
    return done(null, user);
    });

}));