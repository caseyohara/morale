var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server);

var MORALE = 0;

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.post('/', function(req, res) {
  var morale = parseInt(req.body.morale);
  if (morale < 0) morale = 0;
  if (morale > 100) morale = 100;
  MORALE = morale;
  io.sockets.emit('morale', { morale: MORALE });
  res.send(202);
})

io.configure(function() {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function(socket) {
  socket.emit('morale', { morale: MORALE });
});

var port = process.env.PORT || 3000;
server.listen(port);
console.log("Tom Server listening on port " + port);

