var mongoose = require('mongoose');
var localMpassport = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost/Autho-app");

var UserSchema = new mongoose.Schema({
  username : String,
  password : String
});

UserSchema.plugin(localMpassport);
