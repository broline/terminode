define(['knockout', 'jquery', '../model',
        "../terminal"
],
    function (ko, $, ViewModel) {

    	describe('terminal binding', function () {
    		var viewModel;
    		var element;
    		var root;

    		describe('when binding to an element without providing a model', function () {
    			beforeEach(function () {

    				jasmine.Ajax.install();

    				root = document.createElement('div');
    				root.innerHTML = '<div id="binding" data-bind="terminal: true"></div>';
    				document.body.appendChild(root);
    				element = document.getElementById('binding');
    				viewModel = {};
    				ko.applyBindings(viewModel, root);

    				jasmine.Ajax.requests.mostRecent().response({
    					status: 200,
    					contentType: 'application/json',
    					responseText: JSON.stringify({ port: 3001 })
    				});
    			});

    			afterEach(function () {
    				ko.cleanNode(root);
    				$(root).remove();
    				jasmine.Ajax.uninstall();
    			});

    			it('should be bound', function () {
    				expect(ko.dataFor(element)).toBe(viewModel);
    			});
    		});

    	});
    });
