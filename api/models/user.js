var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    username: String,
    name: String,
    surname: String,
    pw: String,
    credit: Number,
    type: Boolean
});

module.exports = mongoose.model('User', UserSchema);