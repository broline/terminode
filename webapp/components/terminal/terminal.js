define(['knockout', 'jquery', 'lodash', './model', 'socket.io',
        'knockout.punches',
		'css!./terminal',
        'template!./template/index.html!terminal-main',
],
    function (ko, $, _, ViewModel, io) {

    	ko.punches.enableAll();

    	ko.bindingHandlers.terminal = {
    		init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

    			var value = ko.utils.unwrapObservable(valueAccessor());

    			viewModel = new ViewModel();

    			viewModel.instanceName = allBindingsAccessor.get('id') || _.uniqueId("terminal--");
    			ko.renderTemplate("terminal-main", viewModel, null, element, "replaceChildren");
    			var $input = $(element).find(".terminal__text--input").first();
    			var $output = $(element).find(".terminal__text--output").first();

    			$output.click(function () { $input.focus();});

    			$input.keydown(function (event) {
    				if (event.which === 13) {
    					if (viewModel.command() === "cls") {
    						viewModel.clear();
    					}
    					viewModel.submit();
    				}
    			});

    			viewModel.output.subscribe(function () {
    				$output.scrollTop($output[0].scrollHeight - $output.height());
    			});

    			return { controlsDescendantBindings: true };
    		},
    		update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

    		}
    	};

    	
    });
