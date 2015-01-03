define(["knockout", "../model", "webapp/hub", "webapp/store",
        "mock-ajax"
],
    function (ko, ViewModel, hub, Store) {
    	describe("terminal binding model", function () {

    		var model;
    		var initialResponse = "hello>";
    		var store = new Store();

    		beforeEach(function () {
    			jasmine.Ajax.install();
    		});

    		afterEach(function () {
    			jasmine.Ajax.uninstall();
    		});

    		describe("when creating a new viewmodel", function () {

    			beforeEach(function () {
    				model = new ViewModel();
    			});

    			it("should be loading", function () {
    				expect(model.isLoading()).toEqual(true);
    			});

    			describe("after a successful server response", function () {

    				beforeEach(function () {
    					jasmine.Ajax.requests.mostRecent().response({
    						status: 200,
    						contentType: 'application/json',
    						responseText: JSON.stringify({ port: 3001 })
    					});
    				});

    				it("should have a port", function () {
    					expect(model.port()).toEqual(3001);
    				});

    				it("should be connected", function () {
    					expect(model.socket().connected).toEqual(true);
    				});

    				describe("and then an initial server socket response", function () {

    					beforeEach(function () {
    						hub.raiseServerEvent(model.socket(), "server", { stdout: initialResponse });
    					});

    					it("should not be loading and should be loaded", function () {
    						expect(model.isLoading()).toEqual(false);
    						expect(model.isLoaded()).toEqual(true);
    					});

    					it("should have a nickname", function () {
    						expect(model.nickname()).toEqual("hello");
    					});

    					it("should have output", function () {
    						expect(model.output()).toEqual(initialResponse);
    					});

    					describe("and then saving terminal with this nickname for the first time", function () {
    						var terminals;
    						beforeEach(function () {
    							model.save();
    							terminals = store.getValue("terminals");
    						});

    						it("should have saved the terminal", function () {
    							expect(terminals[model.nickname()].path).toEqual("hello");
    						});

    						describe("and then changing the name and saving again", function () {

    							beforeEach(function () {
    								model.nickname("a good ol name");
    								model.path("new path");
    								model.save();
    							});

    							it("should have added a new entry with that name", function () {
    								expect(terminals[model.nickname()].path).toEqual("new path");
    								expect(Object.keys(terminals).length).toEqual(2);
    							});
    						});
    					});

    				});


    				describe("then entering a command", function () {

    					var command1 = "git help";

    					beforeEach(function () {
    						model.command(command1);
    					});

    					describe("then submitting", function () {

    						beforeEach(function () {
    							spyOn(hub, 'raiseClientEvent');
    							model.submit();
    						});

    						it("should have raised the client socket event", function () {
    							expect(hub.raiseClientEvent).toHaveBeenCalled();
    						});

    						it("should clear the command", function () {
    							expect(model.command()).toEqual("");
    						});

    						it("should save the command", function () {
    							expect(model.commands()[0]).toEqual(command1);
    						});

    						describe("then entering some more commands and submitting", function () {

    							var command2 = "i am your father",
									command3 = "really, i am";

    							beforeEach(function () {
    								model.command(command2);
    								model.submit();
    								model.command(command3);
    								model.submit();
    							});


    							it("should have a few commands", function () {
    								expect(model.commands().length).toEqual(3);
    							});

    							describe("then getting the previous command", function () {

    								beforeEach(function () {
    									model.getPreviousCommand();
    								});

    								it("should populate command with the last command submitted", function () {
    									expect(model.command()).toEqual(command3);
    								});

    								describe("then doing a bit of shuffling of commands", function () {

    									beforeEach(function () {
    										model.getPreviousCommand();
    										model.getNextCommand();
    										model.getPreviousCommand();
    										model.getPreviousCommand();
    										model.getPreviousCommand();
    										model.getPreviousCommand();
    										model.getNextCommand();
    									});

    									it("should populate command with second command", function () {
    										expect(model.command()).toEqual(command2);
    									});

    								});

    							});
    						});
    					});
    				});
    			});

    		});

    	});
    });
