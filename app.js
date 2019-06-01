var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apis = require("./routes/user");

var common = require("./operations/common");
var { ERROR } = require("./operations/constant");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    common.httpResponse(req, res, ERROR, {
      message: "Authorization token is not found."
    });
    return;
  }

  const app_token = common.getAuthoriztionToken();
  if (token === app_token) {
    next();
  } else common.httpResponse(req, res, ERROR, {
    message: "Authorization token is matched.",
    token: app_token
  });
}, usersRouter);
app.use('/api', apis);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

module.exports = app;
