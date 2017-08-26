var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose')
mongoose.connect('localhost:27017/legubeta');

var users = [
    new User ({
        puserid: 'Administrator',
        pusername: 'Leonard Gurning',
        prole: 'Super User',
        pdept: 'BOD',
        ppassword: bcrypt.hashSync('legubeta', bcrypt.genSaltSync(5), null)
    }),
    new User ({
        puserid: 'carol',
        pusername: 'Carolina',
        prole: 'End User',
        pdept: 'Finance',
        ppassword: bcrypt.hashSync('riniku', bcrypt.genSaltSync(5), null)
    })
];

var done = 0;
for (var i =0; i < users.length; i++){
    users[i].save(function(err, result){
        done++
        if (done === users.length){
            exit()
        }
    });
}

function exit(){
    mongoose.disconnect();
}