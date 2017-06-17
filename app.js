var express = require('express');
var logger  = require('express-log');
var path = require('path');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(logger());
app.use(express.static('static'));

app.get('/', function(req, res) {
  res.render('index', {
    title: '2015 Home Run Derby Champion'
  });
});

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
