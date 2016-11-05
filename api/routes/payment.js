var express = require('express');
var router = express.Router();
var cors = require('cors')

var Payment     = require('../models/payment');

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

router.get('/getAll', cors(corsOptions) , function(req,res){
	Payment.find(function(err, pays) {
        if (err)
            res.send(err);

        res.json(pays);
    });
});

router.put('/update/:pay_id', cors(corsOptions), function(req,res){
	Payment.findById(req.params.pay_id, function(err, bear) {
        if (err)
            res.send(err);

        bear.name = req.query.name;  

        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Pay updated!' });
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