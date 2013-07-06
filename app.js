
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , database = require('./database')
  , paths = require('./database/rest');

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
database.init(app.get('env'), function(tables) {
    console.log(tables);
});
/*connections.init(app.get('env'));
var userRole = "admin";
for (var key in connections.tables) {
    paths.addService(app, connections.tables[key], userRole);
}
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Ska server listening on port ' + app.get('port'));
});
