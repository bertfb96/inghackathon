var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentSchema   = new Schema({
    reference: String,
    businessId: String,
    customerId: String,
    price: Number,
    status: {
    	type: Boolean,
    	default: 0
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);