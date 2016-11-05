var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Payment', PaymentSchema);