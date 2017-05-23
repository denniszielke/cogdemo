var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('./config');
var FaceList = require('./routes/facelist');
var FaceDao = require('./models/faceDao');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Todo App:
var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});
var faceDao = new FaceDao(docDbClient, config.databaseId, config.collectionId);
var faceList = new FaceList(faceDao, config.faceIdHost, config.faceIdHostPort);
faceDao.init();

app.get('/', faceList.showFaces.bind(faceList));
app.get('/scan', faceList.showScans.bind(faceList));
app.post('/addFace', faceList.addFace.bind(faceList));
app.post('/triggerScan', faceList.triggerScan.bind(faceList));
app.set('view engine', 'jade');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
// https://functionc5f84a129e53.blob.core.windows.net/thumbs/6.jpg

// https://dzfaces.blob.core.windows.net/originals/steve3.jpg
