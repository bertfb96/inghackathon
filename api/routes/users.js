var express = require('express');
var router = express.Router();

var cors = require('cors');

var User     = require('../models/user');

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', cors(corsOptions), function(req,res){
    User.find({username: req.query.username, pw: req.query.pw}, function(err, user) {
        if (err)
            res.send(err);

        res.json(user);
    });
});

router.get('/getById', cors(corsOptions), function(req,res){
    User.findById(req.query._id, function(err, user) {
        if (err)
            res.send(err);

        res.json(user);
    });
});

module.exports = router;
