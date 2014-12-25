define(['knockout', 'jquery', 'lodash', './model','socket.io',
        'knockout.punches',
		'css!./terminal',
        'template!./template/index.html!terminal-main',
    ],
    function(ko, $, _, ViewModel, io) {
        
        ko.punches.enableAll();

        ko.bindingHandlers.terminal = {
            init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            	var value = ko.utils.unwrapObservable(valueAccessor());
	
                element.model = new ViewModel();
                element.model.instanceName = allBindingsAccessor.get('id') || _.uniqueId("terminal--");
                ko.renderTemplate("terminal-main", element.model, null, element, "replaceChildren");
                var textArea = $(element).find("textarea.terminal__text").first();

                $.ajax({
                	url: "terminal/",
					type: "GET"
                }).done(function (data) {
                	var socket = io.connect('http://localhost:' + data.port);
                	socket.on('server', function (data) {
                		textArea.val(textArea.val() + "\n" + data.stdout);
                		//socket.emit('my other event', { my: 'data' });
                	});
                });

               

                return { controlsDescendantBindings: true };
            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            }
        };
    });
