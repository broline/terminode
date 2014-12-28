define(['knockout', 'crossroads', 'jquery', './model',
        'text!./index.html!home-index',
		'webapp/components/terminal/terminal'
    ],
    function(ko, crossroads, $, ViewModel, index) {

        var appRoot = $('#__webapp')[0];

        var viewModel = new ViewModel();

        crossroads.addRoute('/', function() {
            appRoot.innerHTML = index;
        });

        crossroads.parse('/');

        ko.applyBindings(viewModel,appRoot);

    });
