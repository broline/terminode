define(["knockout", "socket.io", 'lodash'],
  function (ko, io, _) {
  	function ViewModel() {

  		this.id = _.uniqueId("terminal--");
  		this.nickname = ko.observable("");
  		this.command = ko.observable();
  		this.output = ko.observable("");
  		this.port = ko.observable();
  		this.socket = ko.observable();
  		this.reconnectAttempts = ko.observable(0);
  		this.isLoaded = ko.observable(true);
  		this.isLoading = ko.observable(false);
  		this.selected = ko.observable(false).extend({notify: 'always'});

  		this.load();

  	}

  	ViewModel.prototype.load = function () {
  		this.isLoading(true);
  		$.ajax({
  			url: "api/terminal/",
  			type: "GET",
			context: this
  		}).done(function (data) {
  			this.port(data.port);
  			this.socket(io.connect('http://localhost:' + this.port()));
  			this.socket().on('server', function (data) {
  				if (!this.nickname() && data.stdout && data.stdout.indexOf(">", this.length - 1) !== -1) {
  					var arr = data.stdout.split("\n");
  					this.nickname(arr[arr.length - 1]);
  					this.isLoading(false);
  					this.isLoaded(true);
  				}
  				this.output(this.output() + data.stdout);
  			}.bind(this));
  			this.socket().on('connect_error reconnect_error', function (data) {
  				this.reconnectAttempts(this.reconnectAttempts + 1);
  				if (this.reconnecthis.reconnectAttempts >= 3) {
  					this.load();
  					this.reconnectAttempts(0);
  				}
  			}.bind(this));
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
