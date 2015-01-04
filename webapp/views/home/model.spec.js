define(["knockout", "./model", "webapp/store", "webapp/components/terminal/model",
        "mock-ajax"
],
    function (ko, ViewModel, Store, Terminal) {
    	describe("tabbded terminal viewmodel", function () {

    		var model,
    		initialResponse = "hello>",
    		store = new Store(),
    		terminal1 = new Terminal(store),
			terminal2 = new Terminal(store);
			

    		beforeEach(function () {
    			jasmine.Ajax.install();
    		});

    		afterEach(function () {
    			jasmine.Ajax.uninstall();
    		});

    		describe("when creating a new viewmodel", function () {

    			beforeEach(function () {
    				model = new ViewModel(store);
    			});

    			it("should have added one terminal", function () {
    				expect(model.terminals().length).toEqual(1);
    			});

    			it("should have made the added terminal the selected terminal", function () {
    				expect(model.selectedTerminal()).toBe(model.terminals()[0]);
    			});

    			describe("and there are saved terminals", function () {

    				beforeEach(function () {

    					store.setValue("terminals", null);
    			
    					terminal1.nickname("one");
    					terminal1.path("path1");
    					terminal1.save();

    					terminal2.nickname("two");
    					terminal2.path("path2");
    					terminal2.save();
    				});

    				it("should recognize the saved terminals", function () {
    					expect(Object.keys(model.savedTerminals()).length).toEqual(2);
    				});

    				it("should have list of saved terminal names", function () {
    					expect(model.savedTerminalNames().length).toEqual(2);
    				});

    				describe("then opening one of the saved terminals", function () {

    					beforeEach(function () {
    						model.loadTerminalByName("one");
    					});

    					it("should have properly opened the saved terminal", function () {
    						expect(model.selectedTerminal().nickname()).toEqual("one");
    						expect(model.selectedTerminal().path()).toEqual("path1");
    					});
    				});
    			});

    			describe("then adding a terminal", function () {

    				var newTerminal = {};

    				beforeEach(function () {
    					newTerminal = model.addTerminal();
    				});

    				it("should have added the terminal", function () {
    					expect(model.terminals().length).toEqual(2);
    				});

    				it("should have selected the new terminal", function () {
    					expect(model.selectedTerminal()).toBe(newTerminal);
    				});

    				describe("and removing it while selected", function () {

    					beforeEach(function () {
    						newTerminal = model.remove(newTerminal);
    					});

    					it("should have removed the terminal", function () {
    						expect(model.terminals().length).toEqual(1);
    					});

    					it("should have selected the first terminal", function () {
    						expect(model.selectedTerminal()).toBe(model.terminals()[0]);
    					});
    				});
    			});

    		});

    	});
    });
