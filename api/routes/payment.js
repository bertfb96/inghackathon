var express = require('express');
var router = express.Router();
var cors = require('cors')

var Payment     = require('../models/payment');
var User     = require('../models/user');

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
};


router.get('/', function(req, res, next) {
  res.json({ message: 'hooray! welcome to our api!' });
});


router.get('/getByReferenceId', cors(corsOptions), function(req,res){
    Payment.find({reference: req.query.reference}, function(err, pay) {
        if (err)
            res.send(err);

        console.log(pay);
        res.json(pay);
    });
});

router.get('/getPaymentList', cors(corsOptions), function(req,res){
    Payment.find({businessId: req.query.userId}, function(err, pay) {
        if (err)
            res.send(err);

        res.json(pay);
    });
});

router.get('/getAll', cors(corsOptions) , function(req,res){
	Payment.find(function(err, pays) {
        if (err)
            res.send(err);

        res.json(pays);
    });
});

router.put('/acceptPay/:customerId/:businessId/:price/:reference', cors(corsOptions), function(req,res){
    // for customer
	User.findById(req.params.customerId, function(err, user) {
        if (err)
            res.send(err);

        user.credit -=  parseInt(req.params.price);  

        user.save(function(err) {
            if (err)
                res.send(err);

            // for business
            User.findById(req.params.businessId, function(err, user) {
                if (err)
                    res.send(err);

                user.credit +=  parseInt(req.params.price);  

                user.save(function(err) {
                    if (err)
                        res.send(err);

                    //status update
                    Payment.findOneAndUpdate({reference: req.params.reference}, {status: 1}, function(err, user) {
                        if (err)
                            res.send(err);

                        res.json({ message: 'Pay updated!' });
                    });

                });
            });

        });
    });
});


router.delete('/delete/:pay_id', cors(corsOptions), function(req, res) {
    Payment.remove({
        _id: req.params.pay_id
    }, function(err, bear) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

router.post('/add', cors(corsOptions), function(req, res) {
    var pay = new Payment();      
    pay.reference = req.query.referance;
    pay.businessId = req.query.businessId;  
    pay.price      = req.query.price;

    pay.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Pay created!' });
    });
});

module.exports = router;