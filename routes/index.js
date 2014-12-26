var express = require('express');
var router = express.Router();
var portscanner = require('portscanner')

/* GET home page. */
router.get('/', function (req, res) {
	res.render('home/index', { title: 'terminode' });
});

router.get('/api/terminal', function (req, res) {
	portscanner.findAPortNotInUse(3000, 5000, '127.0.0.1', function (error, port) {
		//console.log('AVAILABLE PORT AT: ' + port)

		var io = require('socket.io')(port);

		
		io.on('connection', function (socket) {
			var prc = require('child_process');
			var cmd = prc.spawn('cmd',['ls']);
			cmd.stdout.on("data", function (data) {
				socket.emit('server', { stdout: String.fromCharCode.apply(null, new Uint16Array(data)) });
			})
		});

		res.send({ port: port });


	});
});

module.exports = router;
