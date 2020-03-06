var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var player = require('./routes/player');
var planet = require('./routes/planet');
var colonize = require('./routes/colonize');
var military = require('./routes/military');

var dataManager = require('./scripts/dataManager');
var app = express();

process.setMaxListeners(0);

//parse Data
dataManager.parseData();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', '*');
    /* OPTIONS, PUT, PATCH, DELETE'*/
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/api/player', player);
app.use('/api/planet', planet);
app.use('/api/colonize', colonize);
app.use('/api/military', military);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
