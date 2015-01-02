define(["knockout", "../model", "webapp/hub", "webapp/store",
        "mock-ajax"
    ],
    function(ko, ViewModel, hub, store) {
        describe("terminal binding model", function() {

        	var model;

            beforeEach(function() {
            	jasmine.Ajax.install();
            });

            afterEach(function () {
            	jasmine.Ajax.uninstall();
            });

            describe("when creating a new viewmodel", function() {

                beforeEach(function() {
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

                	//it("should not be loading and should be loaded", function () {
                	//	expect(model.isLoading()).toEqual(false);
                	//	expect(model.isLoaded()).toEqual(true);
                	//});

                	it("should have a port", function () {
                		expect(model.port()).toEqual(3001);
                	});
                });
            });

        });
    });
