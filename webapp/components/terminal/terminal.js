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
                var $textArea = $(element).find("textarea.terminal__text").first();

                $.ajax({
                	url: "api/terminal/",
					type: "GET"
                }).done(function (data) {
                	var socket = io.connect('http://localhost:' + data.port);
                	socket.on('server', function (data) {
                		$textArea.val($textArea.val() + data.stdout);
                		if ($textArea.length) {
							//scroll to the bottom
                			$textArea.scrollTop($textArea[0].scrollHeight - $textArea.height());
                		}
                	});

                	$textArea.keydown(function (event) {
                		if (event.which === 13) {
                			var arr = $textArea.val().split(">");
                			var val = arr[arr.length - 1];
                			socket.emit("command", val);
                		}
                	});
                });

               

                return { controlsDescendantBindings: true };
            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            }
        };
    });
