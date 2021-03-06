var express = require('express');
var router = express.Router();
var portscanner = require('portscanner')

/* GET home page. */
router.get('/', function (req, res) {
	res.render('home/index', { title: 'terminode' });
});

router.get('/api/terminal/:path?', function (req, res, next) {
	portscanner.findAPortNotInUse(3000, 5000, '127.0.0.1', function (error, port) {
		//console.log('AVAILABLE PORT AT: ' + port)

		var io = require('socket.io')(port);

		var args = req.params.path ? ["/k", "cd " + req.params.path] : [];
		console.log(args);
		io.on('connection', function (socket) {
			var prc = require('child_process');
			var cmd = prc.spawn('cmd', args);
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

			socket.on('close', function () {
				cmd.kill();
			});

			socket.on('disconnect', function () {
				cmd.kill();
			});
		});

		res.send({ port: port });

	});
});

router.post('/api/terminal/{pid}/{command}', function (req, res, pid, cmd) {
	
});

module.exports = router;
