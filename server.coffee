fs = require 'fs'
knox = require "knox" 
express = require "express"
crypto = require 'crypto' 
#spawn = require("child_process").spawn
#dirty hack as i need a stream to upload the data to s3
#stream = process.stdin;

knoxClient = knox.createClient(
    key: "AKIAJHZL2XRAHZZRVLOQ"
    secret: "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"
    bucket: "searchbydrawing"
  )
  



app = express.createServer()
io = require("socket.io").listen(app)
app.use(express.static(__dirname + '/public'));
app.listen 3000
#app.get "/", (req, res) ->
#  res.sendfile __dirname + "/public/index.html"

io.sockets.on "connection", (socket) ->
  
  socket.on "search", (data) ->
    #console.log data
    
    filename = crypto.createHash('md5').update(data.dataurl).digest("hex") + ".png"
  
    #don't need this, as i can use any stream
    #stream = fs.createWriteStream('images/'+filename)
    #stream = fs.createReadStream()
    
    buf = new Buffer(data.dataurl.replace(/^data:image\/\w+;base64,/, ""),'base64')
    
    #console.log buf
    
    req = knoxClient.put('/images/'+filename, {
                 'Content-Length': buf.length,
                 'Content-Type':'image/png'
      })
    
    req.on('response', (res) ->
      if res.statusCode is 200
          console.log('saved to %s', req.url)
          socket.emit('upload success', imgurl: req.url)
      else
          console.log('error %d', req.statusCode)
      )
    
    req.end(buf)
    
    #stream.once('open', (fd) ->
    #  stream.write(buf)
    #  )
    #fs.writeFile( __dirname + '/image.png', buf);
    
    #http://www.google.com/searchbyimage?image_url=http%3A%2F%2Fwww.franz-enzenhofer.com%2Fimg%2Ffotofranzenzenhofer.jpeg