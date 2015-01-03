define(["knockout", 'webapp/components/terminal/model', 'webapp/store'],
  function (ko, Terminal, Store) {
  	function ViewModel() {

  		this.terminals = ko.observableArray();
  		this.selectedTerminal = ko.observable().extend({ notify: 'always' });

  		this.addTerminal();

  	}

  	ViewModel.prototype.addTerminal = function () {
  		var terminal = new Terminal();
  		this.terminals.push(terminal);
  		this.selectedTerminal(terminal);
  	};

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
