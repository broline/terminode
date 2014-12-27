define(["knockout", "socket.io"],
  function (ko, io) {
  	function ViewModel() {

  		this.name = ko.observable("Terminal Name");
  		this.command = ko.observable();
  		this.output = ko.observable();
  		this.port = ko.observable();
  		this.socket = ko.observable();
  		this.reconnectAttempts = ko.observable(0);

  		this.port.subscribe(function (newPort) {
  			this.socket(io.connect('http://localhost:' + newPort));
  			this.socket().on('server', function (data) {
  				this.output(this.output() + data.stdout);
  			}.bind(this));
  			this.socket().on('connect_error reconnect_error', function (data) {
  				this.reconnectAttempts(this.reconnectAttempts + 1);
  				if (this.reconnecthis.reconnectAttempts >= 3) {
  					this.load();
  					this.reconnectAttempts(0);
  				}
  			}.bind(this));
  		}, this);

  		this.load();

  	}

  	ViewModel.prototype.load = function () {
  		$.ajax({
  			url: "api/terminal/",
  			type: "GET",
			context: this
  		}).done(function (data) {
  			this.port(data.port);
  		}.bind(this));
  	};

  	ViewModel.prototype.clear = function () {
  		this.output("");
  	};

  	ViewModel.prototype.submit = function () {
  		this.socket().emit("command", this.command());
  		this.command("");
  	};

  	return ViewModel;
  });
