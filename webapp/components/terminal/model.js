define(["knockout", 'lodash', 'webapp/hub', 'webapp/store', './platform-factory'],
  function (ko, _, hub, Store, factory) {
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
  		this.isLoaded = ko.observable(false);
  		this.isLoading = ko.observable(false);
  		this.selected = ko.observable(false).extend({ notify: 'always' });
  		this.platform = null;
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
  			url: "api/terminal/" + (this.path() ? encodeURIComponent(this.path()) : ""),
  			type: "GET",
  			context: this
  		}).done(function (data) {
  			this.port(data.port);
  			this.socket(hub.connect(this.port()));

  			hub.registerEvent(this.socket(), 'server', function (data) {
  				if (!this.platform) {
  					this.platform = factory.getPlatform(data.platform);
  				}
  				var arr = data.stdout.split("\n");
  				var lastLine = arr[arr.length - 1];
  				var isLastLineTheEnd = (data.stdout && data.stdout.indexOf(this.platform.endDelimiter, this.length - 1) !== -1);
  				var isLastCommandChangeDirectory = (this.commands()[0] && (this.commands()[0].split(" ")[0] === this.platform.commands.changeDirectory));

  				
  				if (isLastCommandChangeDirectory || (isLastLineTheEnd && !this.path())) {
  					//if last command was change directory, or theres no nickname yet, change path/nickname and save
  					this.path(lastLine.substring(0, lastLine.length - 1)); //remove the gt
  					if (!this.nickname()) {
  						this.nickname(this.path());
  					}
  					this.save();
  				}
  				if (!this.isLoaded() && isLastLineTheEnd) {
  					//if not loded and ther is a response from server with the end delimiter signaling that the terminal is ready for use
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
  		if (this.platform && (this.command() === this.platform.commands.clear)) {
  			this.clear();
  		}
  		hub.raiseClientEvent(this.socket(), "command", this.command());
  		this.commands.unshift(this.command());
  		this.previousCommandIndex(-1);
  		this.command("");
  	};

  	return ViewModel;
  });
