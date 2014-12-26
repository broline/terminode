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
			cmd = prc.spawn('cmd');
			cmd.stdout.on("data", function (data) {
				var dat = String.fromCharCode.apply(null, new Uint16Array(data));
				socket.emit('server', { stdout: dat });
			})
			cmd.stderr.on("data", function (data) {
				var dat = String.fromCharCode.apply(null, new Uint16Array(data));
				socket.emit('server', { stdout: dat });
			})
			socket.on('command', function (command) {
				cmd.stdin.write(command + "\n");
			});
		});

		res.send({ port: port });

	});
});

router.post('/api/terminal/{pid}/{command}', function (req, res, pid, cmd) {
	
});

module.exports = router;
