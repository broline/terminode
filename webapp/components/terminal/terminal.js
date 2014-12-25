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

                var socket = io.connect('http://localhost:3001');
                socket.on('server', function (data) {
                	console.log(data);
                	//socket.emit('my other event', { my: 'data' });
                });

                return { controlsDescendantBindings: true };
            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            }
        };

        ko.virtualElements.allowedBindings.terminal = true;
    });
