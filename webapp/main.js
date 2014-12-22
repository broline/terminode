define(["app/config"], function(config) {

    if(config.script){
      require([config.script]);
    }

});
