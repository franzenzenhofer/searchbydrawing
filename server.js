(function() {
  var app, crypto, express, fs, io, knox, knoxClient;
  fs = require('fs');
  knox = require("knox");
  express = require("express");
  crypto = require('crypto');
  knoxClient = knox.createClient({
    key: "AKIAJHZL2XRAHZZRVLOQ",
    secret: "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",
    bucket: "searchbydrawing"
  });
  app = express.createServer();
  io = require("socket.io").listen(app);
  app.use(express.static(__dirname + '/public'));
  app.listen(3000);
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
