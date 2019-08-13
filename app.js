var createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),

    indexRouter = require('./routes/index'),
    usersRouter = require('./routes/users'),
    apis = require("./routes/user"),
    swaggerUi = require('swagger-ui-express');

/** Csv to json file */
var csv_to_json_apis = require('./routes/csvtojson/action');

var common = require("./operations/common");
var { SUCCESS, BAD_REQUEST, FORBIDDEN } = require("./operations/constant");

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

var options = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: "http://localhost:5000/swagger/userdata.json",
        name: 'Spec1'
      },
      {
        url: "http://localhost:5000/swagger/swagger.json",
        name: 'Spec2'
      },
      {
        url: "http://localhost:5000/swagger/users.json",
        name: 'users'
      }
    ]
  }
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));

/* GET users listing. */
app.get('/v0/users/ping', function (req, res) {
  common.httpResponse(req, res, SUCCESS, {
      message: "System is working fine"
  })
});

app.use('/v0/users', (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    common.httpResponse(req, res, BAD_REQUEST, {
      message: "Authorization token is not found."
    });
    return;
  }

  const app_token = common.getAuthoriztionToken();
  if (token === app_token) {
    next();
  } else common.httpResponse(req, res, FORBIDDEN, {
    message: "Authorization token is not matched.",
    token: app_token
  });
}, usersRouter);
app.use('/api', apis);
app.use('/csv/to/json', csv_to_json_apis);

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
