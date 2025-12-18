var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var pizzasRouter = require('./routes/pizzas');
var ingredientsRouter = require('./routes/ingredients');
var specialRouter = require('./routes/special');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log('REQ:', req.method, req.url);
    next();
});

app.use('/', indexRouter);
app.use('/pizzas', pizzasRouter);
app.use('/ingredients',ingredientsRouter);
app.use('/special', specialRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({error: err.message || "Erreur serveur"});
});

app.get('/test', (req, res) => {
    res.send('SERVEUR OK');
});

module.exports = app;
