var express = require('express');
var router = express.Router();
var portscanner = require('portscanner')

/* GET home page. */
router.get('/', function (req, res) {
	res.render('home/index', { title: 'terminode' });
});

router.get('/terminal', function (req, res) {
	portscanner.findAPortNotInUse(3000, 5000, '127.0.0.1', function (error, port) {
		//console.log('AVAILABLE PORT AT: ' + port)

		var io = require('socket.io')(port);
		io.on('connection', function (socket) {
			socket.emit('server', { hello: 'world' });
			//socket.on('my other event', function (data) {
			//	console.log(data);
			//});
		});
		res.send({port: port});
	});
});

module.exports = router;
