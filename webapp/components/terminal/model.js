define(["knockout", 'lodash', 'webapp/hub', 'webapp/store'],
  function (ko, _, hub, Store) {
  	function ViewModel(store, data) {
  		data = data || {};

  		this.id = _.uniqueId("terminal--");
  		this.nickname = ko.observable(data.nickname || "");
  		this.path = ko.observable(data.path || "");
  		this.command = ko.observable();
  		this.commands = ko.observableArray();
  		this.previousCommandIndex = ko.observable(-1);
  		this.output = ko.observable("");
  		this.port = ko.observable();
  		this.socket = ko.observable();
  		this.reconnectAttempts = ko.observable(0);
  		this.isLoaded = ko.observable(true);
  		this.isLoading = ko.observable(false);
  		this.selected = ko.observable(false).extend({ notify: 'always' });
  		var _store = store || new Store();
		
  		

  		this.getPreviousCommand = function () {
  			if (this.commands().length && (this.commands().length - 1) >= this.previousCommandIndex() + 1) {
  				this.previousCommandIndex(this.previousCommandIndex() + 1);
  				this.command(this.commands()[this.previousCommandIndex()]);
  			}
  		}.bind(this);

  		this.getNextCommand = function () {
  			if (this.previousCommandIndex() > -1) {
  				this.previousCommandIndex(this.previousCommandIndex() - 1);
  				if (this.previousCommandIndex() === -1) {
  					this.command("");
  				} else {
  					this.command(this.commands()[this.previousCommandIndex()]);
  				}
  			}
  		}.bind(this);

  		this.save = function () {
  			var terminals = _store.getValue("terminals");
  			if (!terminals) {
  				terminals = {};
  			}
  			var term = {
  				nickname: this.nickname(),
  				path: this.path()
  			};

  			terminals[term.nickname] = term;

  			_store.setValue("terminals", terminals);
  		}.bind(this);

  		this.editableOptions = {
  			save: this.save
  		};

  		this.load();

  	}

  	ViewModel.prototype.load = function () {
  		this.isLoading(true);
  		$.ajax({
  			url: "api/terminal/" + this.path(),
  			type: "GET",
  			context: this
  		}).done(function (data) {
  			this.port(data.port);
  			this.socket(hub.connect(this.port()));
  			hub.registerEvent(this.socket(), 'server', function (data) {
  				if (!this.nickname() && data.stdout && data.stdout.indexOf(">", this.length - 1) !== -1) {
  					var arr = data.stdout.split("\n");
  					var str = arr[arr.length - 1];
  					this.path(str.substring(0, str.length - 1)); //remove the gt
  					if (!this.nickname()) {
  						this.nickname(this.path());
  					}
  					this.isLoading(false);
  					this.isLoaded(true);
  				}
  				this.output(this.output() + data.stdout);
  			}.bind(this));
  			hub.registerEvent(this.socket(), 'connect_error reconnect_error', function (data) {
  				this.reconnectAttempts(this.reconnectAttempts + 1);
  				if (this.reconnectAttempts >= 3) {
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
  		hub.raiseClientEvent(this.socket(), "command", this.command());
  		this.commands.unshift(this.command());
  		this.previousCommandIndex(-1);
  		this.command("");
  	};

  	return ViewModel;
  });
