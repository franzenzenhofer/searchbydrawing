(function() {
  $(function() {
    var c, captureToCanvas, cd, colors, default_height, default_width, fo, hasFlash, ii, isIApple, isMobile, jj, passLine, sCanvas, sCtx, sImageData, socket, transDataUri;
    cd = new CanvasDrawing("canvas");
    default_width = cd.canvas.width + 0;
    default_height = cd.canvas.height + 0;
    cd.options.lineWidth = 50;
    colors = "000000,000033,000066,000099,0000CC,0000FF,003300,003333,003366,003399,0033CC,0033FF,006600,006633,006666,006699,0066CC,0066FF,009900,009933,009966,009999,0099CC,0099FF,00CC00,00CC33,00CC66,00CC99,00CCCC,00CCFF,00FF00,00FF33,00FF66,00FF99,00FFCC,00FFFF,330000,330033,330066,330099,3300CC,3300FF,333300,333333,333366,333399,3333CC,3333FF,336600,336633,336666,336699,3366CC,3366FF,339900,339933,339966,339999,3399CC,3399FF,33CC00,33CC33,33CC66,33CC99,33CCCC,33CCFF,33FF00,33FF33,33FF66,33FF99,33FFCC,33FFFF,660000,660033,660066,660099,6600CC,6600FF,663300,663333,663366,663399,6633CC,6633FF,666600,666633,666666,666699,6666CC,6666FF,669900,669933,669966,669999,6699CC,6699FF,66CC00,66CC33,66CC66,66CC99,66CCCC,66CCFF,66FF00,66FF33,66FF66,66FF99,66FFCC,66FFFF,990000,990033,990066,990099,9900CC,9900FF,993300,993333,993366,993399,9933CC,9933FF,996600,996633,996666,996699,9966CC,9966FF,999900,999933,999966,999999,9999CC,9999FF,99CC00,99CC33,99CC66,99CC99,99CCCC,99CCFF,99FF00,99FF33,99FF66,99FF99,99FFCC,99FFFF,CC0000,CC0033,CC0066,CC0099,CC00CC,CC00FF,CC3300,CC3333,CC3366,CC3399,CC33CC,CC33FF,CC6600,CC6633,CC6666,CC6699,CC66CC,CC66FF,CC9900,CC9933,CC9966,CC9999,CC99CC,CC99FF,CCCC00,CCCC33,CCCC66,CCCC99,CCCCCC,CCCCFF,CCFF00,CCFF33,CCFF66,CCFF99,CCFFCC,CCFFFF,FF0000,FF0033,FF0066,FF0099,FF00CC,FF00FF,FF3300,FF3333,FF3366,FF3399,FF33CC,FF33FF,FF6600,FF6633,FF6666,FF6699,FF66CC,FF66FF,FF9900,FF9933,FF9966,FF9999,FF99CC,FF99FF,FFCC00,FFCC33,FFCC66,FFCC99,FFCCCC,FFCCFF,FFFF00,FFFF33,FFFF66,FFFF99,FFFFCC,FFFFFF".split(",");
    cd.setOption("color", '#' + colors[Math.floor(Math.random() * colors.length)]);
    socket = io.connect();
    socket.on("upload success", function(data) {
      return window.location = 'http://www.google.com/searchbyimage?nota=1&image_url=' + encodeURI(data.imgurl);
    });
    transDataUri = function() {
      return socket.emit('search', {
        dataurl: cd.canvas.toDataURL("image/png")
      });
    };
    $('#search').click(function() {
      return transDataUri();
    });
    $('.color').click(function() {
      return cd.setOption("color", '#' + this.getAttribute("data-color"));
    });
    $('#addcolorbutton').click(function() {
      var nc, v;
      v = $('#addcolor').val();
      if (v && v !== '') {
        nc = $('<li style="background-color:#' + v + '" data-color="' + v + '" class="color"></li>');
        nc.click(function() {
          return cd.setOption("color", '#' + this.getAttribute("data-color"));
        });
        $('#colors').prepend(nc);
        $('#addcolor').css('background-color', '#' + v);
        return cd.setOption("color", '#' + v);
      }
    });
    $('#brushsizebutton').click(function() {});
    isIApple = function() {
      if ((navigator.userAgent.indexOf('iPhone') !== -1) || (navigator.userAgent.indexOf('iPod') !== -1) || (navigator.userAgent.indexOf('iPad') !== -1)) {
        return true;
      } else {
        return false;
      }
    };
    isMobile = function() {
      if ((navigator.userAgent.indexOf('mobile') !== -1) || (navigator.userAgent.indexOf('Mobile') !== -1)) {
        return true;
      } else {
        return false;
      }
    };
    (function() {
      var input;
      input = document.createElement("input");
      input.setAttribute("type", "range");
      if ((input.type !== 'range') || (isIApple())) {
        $('#range').remove();
        return $('#rangewrapper').html('<lable>Brush size:&nbsp;</lable><select id="range" style="width:70%;">\n<option value=\'1\'> 1px </option>\n<option value=\'5\'> 5px </option>\n<option value=\'10\'> 10px </option>\n<option value=\'20\'> 20px </option>\n<option value=\'30\'> 30px </option>\n<option value=\'40\'> 40px </option>\n<option value=\'50\' selected> 50px </option>\n<option value=\'60\'> 60px </option>\n<option value=\'80\'> 80px </option>\n<option value=\'90\'> 90px </option>\n<option value=\'100\'> 100px </option>\n<option value=\'120\'> 120px </option>\n<option value=\'150\'> 150px </option>\n<option value=\'200\'> 200px </option>\n </select>');
      }
    })();
    $('#range').change(function() {
      cd.setOption("lineWidth", this.value);
      return $('#brushsize').val(this.value);
    });
    $('#brushsizebutton').click(function() {
      var bz, isNumber;
      isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      };
      bz = $('#brushsize').val();
      if (isNumber(bz)) {
        cd.setOption("lineWidth", bz);
        return $('#range').val(bz);
      }
    });
    $('#range').val(50);
    $('#brushsize').val(50);
    (function() {
      if (isMobile()) {
        return $('h1').after('<div class="warning">Device not supported! <b>:(</b></div>\n<div class="note">Sadly, there is a redirect bug on the <b>Google</b> website for mobile decives. On the <b>Google Search by Image</b> page, Google <b><i>redirects mobile devices from the result page to the Google homepage</i></b>, so you can not view the result of your search. Sorry. The bug is already reported to Google. The only workaround is to use a non mobile browser.</div>');
      }
    })();
    (function() {
      return $('#googlelogo').html('<span style="color: #0140CA;">G</span><span style="color: #DD1812;">o</span><span style="color: #FCCA03;">o</span><span style="color: #0140CA;">g</span><span style="color: #16A61E;">l</span><span style="color: #DD1812;">e</span>');
    })();
    cd.canvas.ondragover = function() {
      this.className = "hover";
      return false;
    };
    cd.canvas.ondragend = function() {
      this.className = "";
      return false;
    };
    cd.canvas.ondrop = function(e) {
      var file, reader;
      this.className = "";
      e.preventDefault();
      file = e.dataTransfer.files[0];
      reader = new FileReader();
      reader.onload = function(event) {
        var img;
        img = new Image();
        img.onload = function(event) {
          var newheight, newwidth;
          img = this;
          if (img.width > img.height) {
            newheight = img.height * (default_width / img.width);
            newwidth = default_width;
          } else {
            newwidth = img.width * (default_height / img.height);
            newheight = default_height;
          }
          return window.setTimeout((function() {
            cd.canvas.width = newwidth;
            cd.canvas.height = newheight;
            return cd.context.drawImage(img, 0, 0, newwidth, newheight);
          }), 150);
        };
        return img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      return false;
    };
    sCanvas = document.createElement('canvas');
    sCanvas.width = 320;
    sCanvas.height = 240;
    sCtx = sCanvas.getContext("2d");
    sImageData = sCtx.getImageData(0, 0, 320, 240);
    ii = 0;
    jj = 0;
    c = 0;
    passLine = function(stringPixels) {
      var b, coll, g, i, intVal, r;
      coll = stringPixels.split("-");
      i = 0;
      while (i < 320) {
        intVal = parseInt(coll[i]);
        r = (intVal >> 16) & 0xff;
        g = (intVal >> 8) & 0xff;
        b = intVal & 0xff;
        sImageData.data[c + 0] = r;
        sImageData.data[c + 1] = g;
        sImageData.data[c + 2] = b;
        sImageData.data[c + 3] = 255;
        c += 4;
        i++;
      }
      if (c >= 320 * 240 * 4) {
        c = 0;
        sCtx.putImageData(sImageData, 0, 0);
        return cd.context.drawImage(sCanvas, 0, 0, cd.canvas.width, cd.canvas.height);
      }
    };
    window.passLine = passLine;
    captureToCanvas = function() {
      var flash;
      flash = document.getElementById("embedflash");
      return flash.ccCapture();
    };
    $('#takeaphoto').click(function() {
      captureToCanvas();
      return document.location = '#top';
    });
    hasFlash = false;
    try {
      fo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
      if (fo) {
        hasFlash = true;
      }
    } catch (e) {
      if (navigator.mimeTypes["application/x-shockwave-flash"] !== void 0) {
        hasFlash = true;
      }
    }
    if (!hasFlash) {
      return $('.withflash').hide();
    }
  });
}).call(this);
