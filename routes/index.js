var express = require('express');
var router = express.Router();
var app = require('../app');
var io = require('socket.io')(3001);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home/index', { title: 'terminode' });
});

io.on('connection', function (socket) {
	socket.emit('server', { hello: 'world' });
	//socket.on('my other event', function (data) {
	//	console.log(data);
	//});
});

module.exports = router;
