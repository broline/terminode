define(['app/config',
	'knockout.punches'], function (config) {

    if(config.script){
      require([config.script]);
    }

});
