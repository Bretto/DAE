
/**
 * Module dependencies.
 */

var express = require('express')
    , app = express()
    , http = require('http')
    , path = require('path')
    , server = http.createServer(app);


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon())
    .use(express.logger('dev'))
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(express.static(path.join(__dirname, 'public')))
    .use(app.router);


//app.get('/', function(req, res){
//   res.render('index');
//});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.configure('production', function(){
    winston.add(winston.transports.File, { filename: 'node.log', json: false });
    app.use(errorHandler());
});

server.listen(app.get('port'));

