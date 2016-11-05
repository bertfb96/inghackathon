var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentSchema   = new Schema({
    referance: String,
    businessId: String,
    customerId: String,
    price: Number
});

module.exports = mongoose.model('Payment', PaymentSchema);