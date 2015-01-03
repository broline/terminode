define(['knockout', 'jquery', './model', 'socket.io',
        'knockout.punches',
		'css!./terminal',
        'template!./template/index.html!terminal-main',
		'ko.xedit'
],
    function (ko, $, ViewModel, io) {

    	ko.punches.enableAll();

    	ko.bindingHandlers.terminal = {
    		init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

    			return { controlsDescendantBindings: true };
    		},
    		update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    			var value = ko.utils.unwrapObservable(valueAccessor());

    			viewModel = (value && value !== true) ? value : new ViewModel();

    			ko.renderTemplate("terminal-main", viewModel, null, element, "replaceChildren");
    			var $input = $(element).find(".terminal__text--input").first();
    			var $output = $(element).find(".terminal__text--output").first();

    			$output.click(function () { $input.focus(); });

    			$input.keydown(function (event) {
    				if (event.which === 13) { //enter
    					viewModel.submit();
    				}
    				if (event.which === 38) { //up arrow
    					viewModel.getPreviousCommand();
    				}
    				if (event.which === 40) { //up arrow
    					viewModel.getNextCommand();
    				}
    			});

    			viewModel.output.subscribe(function () {
    				$output.scrollTop($output[0].scrollHeight - $output.height());
    			});

    			viewModel.selected.subscribe(function () {
    				$output.scrollTop($output[0].scrollHeight - $output.height());
    			});
    		}
    	};

    	
    });
