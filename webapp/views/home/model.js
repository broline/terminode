define(["knockout", 'lodash', 'webapp/components/terminal/model', 'webapp/store'],
  function (ko, _, Terminal, Store) {
  	function ViewModel(store) {

  		var _store = store || new Store();
  		this.terminals = ko.observableArray();
  		this.selectedTerminal = ko.observable().extend({ notify: 'always' });


  		this.savedTerminals = ko.observable(_store.getValue("terminals"));
  		_store.on("valueChanged", function (data) {
  			if (data.name === "terminals") {
  				this.savedTerminals(data.value);
  			}
  		}.bind(this));

  		this.savedTerminalNames = ko.computed(function () {
  			return _.map(this.savedTerminals(), function (data) {
  				return data.nickname;
  			});
  		}, this);


  		this.addTerminal = function (terminalData) {
  			var terminal = new Terminal(_store, terminalData);
  			this.terminals.push(terminal);
  			this.selectedTerminal(terminal);
  			return terminal;
  		};

  		this.loadTerminalByName = function (name) {
  			var terminal = _.first(_.where(this.savedTerminals(), {nickname: name}));
  			if (terminal) {
  				this.addTerminal(terminal);
  			}
  		};

  		this.addTerminal();

  	}

  	ViewModel.prototype.select = function (terminal) {
  		this.selectedTerminal(terminal);
  		if (this.selectedTerminal()) {
  			this.selectedTerminal().selected(true);
  		}
  	};
  	ViewModel.prototype.remove = function (terminal) {
  		var idx = this.terminals.indexOf(terminal);
  		this.terminals.remove(terminal);
  		terminal = null;
  		if (idx && this.terminals()[idx - 1]) {
  			this.select(this.terminals()[idx - 1]);
  		} else {
  			if (this.terminals().length) {
  				this.select(this.terminals()[0]);
  			} else {
  				this.select(null);
  			}
  		}
  	};

  	return ViewModel;
  });
