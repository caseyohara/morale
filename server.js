var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    cache   = require('redis-url').connect(process.env.REDISTOGO_URL),
    Morale  = require('./lib/morale');

cache.get('morale', function (err, morale) {
  if (!morale) {
    cache.set('morale', new Morale(50).toString());
  }
});

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.configure(function() {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function(socket) {
  cache.get('morale', function (err, morale) {
    var morale = Morale.fromString(morale);
    socket.emit('morale', morale.toJSON());
  });

  socket.on('update', function (data) {
    var morale = new Morale(data.morale);

    cache.set('morale', morale.toString(), function(err){
      io.sockets.emit('morale', morale.toJSON());
    });
  });
});

var port = process.env.PORT || 3000;
server.listen(port);

