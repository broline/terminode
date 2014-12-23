var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); //# use .html extension for templates
app.set('layout', './layouts/base'); //# use layout.html as the default layout
var stylesTemplate;

stylesTemplate = "./layouts/styles-" + process.env.NODE_ENV.trim();
app.set('partials',{styles: stylesTemplate});  //# define partials available to all pages
app.enable('view cache');
app.engine('html', require('hogan-express'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//return this payload with each request
app.use(function(req, res, next) {
    var view,
        segment = req.url.split('/')[0];

    if (!segment) {
        view = "home";
    } else {
        view = segment;
    }
    res.locals = {
        app: {
            env: process.env.NODE_ENV === "production" ? "prod" : "dev",
            name: 'terminode'
        },
        page:{
          view: view
        }
    };
    next();
});

//register routes
app.use('/', routes);

//register static content, scripts, images, fonts, etc...
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/webapp', express.static(__dirname + '/webapp'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV !== 'production') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
