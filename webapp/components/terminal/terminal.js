define(['knockout', 'jquery', 'lodash', './model',
        'knockout.punches',
		'css!terminal',
        'template!./template/index.html!terminal-main',
    ],
    function(ko, $, _, ViewModel) {
        
        ko.punches.enableAll();

        ko.bindingHandlers.terminal = {
            init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

                var value = ko.utils.unwrapObservable(valueAccessor());
                element.model = new ViewModel();
                element.model.instanceName = allBindingsAccessor.get('id') || _.uniqueId("terminal--");
                ko.renderTemplate("terminal-main", element.model, null, element, "replaceChildren");
                return { controlsDescendantBindings: true };
            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

                element.value = ko.utils.unwrapObservable(valueAccessor());
            }
        };

        ko.virtualElements.allowedBindings.terminal = true;
    });
