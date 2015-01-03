/**
 * Module dependencies.
 */

var express = require('express'),
  cons = require('consolidate'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  routicle = require('./routicle');

var app = express();

// Let's try this
app.engine('html', cons.underscore);
app.set('view engine', 'html');
// ///

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

// development only

// Default Navigation
app.get('/', routes.index);

// REST
app.use('/routicle', routicle.routes(app.get('env')));

http.createServer(app).listen(app.get('port'), function() {
  console.log('Backbone test server listening on port ' + app.get('port'));
});
