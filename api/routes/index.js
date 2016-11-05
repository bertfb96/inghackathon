var express = require('express');
var router = express.Router();

var cors = require('cors');

var User     = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index');
});


module.exports = router;
