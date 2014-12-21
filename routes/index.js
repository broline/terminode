var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  debugger
  res.render('home/index', { title: 'terminode' });
});

module.exports = router;
