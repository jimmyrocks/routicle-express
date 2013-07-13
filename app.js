
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , routicle = require('./routicle');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Navigation
app.get('/', routes.index);
app.get('/users', user.list);

// REST
app.use("/routicle", routicle.routes(app.get('env')));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Ska server listening on port ' + app.get('port'));
});
