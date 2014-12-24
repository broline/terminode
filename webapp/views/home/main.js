define(['knockout', 'crossroads', 'jquery',
        'text!./index.html!home-index',
		'webapp/components/terminal/terminal'
    ],
    function(ko, crossroads, $, index) {

        var appRoot = $('#__webapp')[0];

        var viewModel = {};

        crossroads.addRoute('/', function() {
            appRoot.innerHTML = index;
        });

        crossroads.parse('/');

        ko.applyBindings(viewModel,appRoot);

    });
