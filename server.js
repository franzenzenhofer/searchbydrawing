(function() {
  var app, config, crypto, express, fs, io, knox, knoxClient, port;
  fs = require('fs');
  knox = require("knox");
  express = require("express");
  crypto = require('crypto');
  config = require('./config.coffee');
  knoxClient = knox.createClient({
    key: config.s3_key,
    secret: config.s3_secret,
    bucket: "searchbydrawing"
  });
  app = express.createServer();
  io = require("socket.io").listen(app);
  io.configure(function() {
    io.set("transports", ["xhr-polling"]);
    return io.set("polling duration", 10);
  });
  app.use(express.static(__dirname + '/public'));
  port = process.env.PORT ? process.env.PORT : 3000;
  console.log('listening on port ' + port);
  console.log('http://localhost:' + port + '/');
  app.listen(port);
  io.sockets.on("connection", function(socket) {
    return socket.on("search", function(data) {
      var buf, filename, req;
      filename = crypto.createHash('md5').update(data.dataurl).digest("hex") + ".png";
      buf = new Buffer(data.dataurl.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      req = knoxClient.put('/images/' + filename, {
        'Content-Length': buf.length,
        'Content-Type': 'image/png'
      });
      req.on('response', function(res) {
        if (res.statusCode === 200) {
          console.log('saved to %s', req.url);
          return socket.emit('upload success', {
            imgurl: req.url
          });
        } else {
          return console.log('error %d', req.statusCode);
        }
      });
      return req.end(buf);
    });
  });
}).call(this);
