var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema ({
    puserid: {type: String, required: true},
    pusername: {type: String, required: true},
    prole: {type: String, required: true},
    pdept: {type: String, required: true},
    ppassword: {type: String, required: true}
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.ppassword);
};

module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){
    newUser.ppassword = newUser.encryptPassword(newUser.ppassword);
    newUser.save(callback);
};