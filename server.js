var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs');

// creating the server ( localhost:8000 )
app.listen(8000);

// on server start we can load our client.html page
function handler(req, res) {
  fs.readFile(__dirname + '/client.html', function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(500);
      return res.end('Error loading client.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function(socket) {
  console.log(__dirname);
  fs.watch(__dirname + '/geo.json', function(curr, prev) {
    fs.readFile(__dirname + '/geo.json', function(err, data) {
      if (err) throw err;
      // parse data
      var json = JSON.parse(data);
      // adding the time of the last update
      json.time = new Date();
      // send the new data to the client
      socket.volatile.emit('msg', json);
    });
  });
});
