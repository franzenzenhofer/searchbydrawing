/**
*/
/**
THIS IS A FORK OF 
https://github.com/balaclark/Canvas-Drawing
*/

/**
 * CanvasDrawing Constructor.
 *
 * Setup default values, the canvas element, and add interface.
 *
 * @author Bala Clark
 * @constructor
 * @param {String} canvasId Id of the canvas element to be used.
 * @param {Object} options Any user defined options.
 */
function CanvasDrawing(canvasId, options) {

	var cd = CanvasDrawing.prototype,
		defaults = {
			brush: "marker",
			lineWidth: 2,
			color: "#000",
			"background-color": "white",
			freeDrawing: true,
			smoothBrush: true
		};
	
	// replace defaults with user defined options
	cd.options = defaults.merge(options);
	
	// init canvas
	cd.canvas = document.getElementById(canvasId);
	cd.context = cd.canvas.getContext("2d");

	// set initial background colour
	cd.context.fillStyle = cd.options["background-color"];
	cd.context.fillRect(0, 0, cd.canvas.width, cd.canvas.height);

	// setup user drawing controls, specific functions are used to translate the MouseEvent to x / y coordinates
	function controls(e) {
		
		var offset = e.offset(),
			x = offset.x,
			y = offset.y;

  //this fuckss with the range controll on the site, so i disabled it
	if (e.preventDefault && e.srcElement && e.srcElement.id==canvasId) { e.preventDefault(); }
	//e.preventDefault();
		
		switch (e.type) {
		
		  case "mousedown": 
			case "onmousedown":
        cd.drawStart(x, y);
				break;
		
		  case "mousemove": 
			case "onmousemove":
				cd.draw(x, y);
				break;
			
			case "touchmove":
			  if(!cd.drawing) { cd.drawStart(x, y); }
			  cd.draw(x, y);
			  break;

	    case "touchstart":
	      cd.drawStart(x, y);
			  break;
			
			case "touchend":
			  cd.drawStop();
			  break;
      
      case "mouseup": 
			case "onmouseup":
				cd.drawStop();
				break;
				
			case "mouseout":
				cd.drawPause();
				break;
				
			case "mouseover":
				cd.drawResume(x, y);
				break;
		}
	}

	// add click & touch interfaces
	if (cd.options.freeDrawing) {
		if (cd.canvas.addEventListener) {
			// mouse events
			//changes all to "true"
			cd.canvas.addEventListener("mousedown", controls, true);
			cd.canvas.addEventListener("mousemove", controls, true);
			cd.canvas.addEventListener("mouseout", controls, true);
			cd.canvas.addEventListener("mouseover", controls, true);
			//cd.canvas.addEventListener("mouseup", controls, true);
			document.addEventListener("mouseup", controls, true);
			// touch events
			cd.canvas.addEventListener("touchstart", controls, true);
			cd.canvas.addEventListener("touchmove", controls, true);
			//cd.canvas.addEventListener("touchend", controls, true);
			document.addEventListener("touchend", controls, true);
		} else {
			// IE
			cd.canvas.attachEvent("onmousedown", controls);
			cd.canvas.attachEvent("onmousemove", controls);
			document.attachEvent("onmouseup", controls);
		}
	}
}

/**
 * Change an option on the fly.
 *
 * @param option {String} The option key
 * @param value {String} The new option value
 */
CanvasDrawing.prototype.setOption = function(option, value) {
	
	var cd = CanvasDrawing.prototype;

	if (!cd.options.hasOwnProperty(option)) { throw "Invalid CanvasDrawing option: '" + option + "'"; }

	// enforce a minimum line width
	if (option === "lineWidth" && value < 0.1) { value = 0.1; }

	cd.options[option] = value;
};

/**
 * Initialise the drawing instrument & start position.
 *
 * @param x {Number}
 * @param y {Number}
 */
CanvasDrawing.prototype.drawStart = function(x, y) {

	var cd = CanvasDrawing.prototype;

	cd.drawing = true;

	// setup common brush attributes
	cd.context.strokeStyle = cd.options.color;
	cd.context.fillStyle = cd.options.color;
	cd.context.lineWidth = cd.options.lineWidth;

	// save current position
	cd.oldX = x;
	cd.oldY = y;

	// draw initial dot (otherwise nothing will draw unless the brush is dragged)
	cd.brush[cd.options.brush](x + 0.001, y + 0.001);
};

/**
 * Draw a path.
 *
 * @param x {Number}
 * @param y {Number}
 */
CanvasDrawing.prototype.draw = function(x, y) {

	var cd = CanvasDrawing.prototype;

	// draw
	if (cd.drawing) { cd.brush[cd.options.brush](x, y); }
	
	// save current mouse position
	cd.oldX = x;
	cd.oldY = y;
};

/**
 * The brushes.
 * These methods will directly output to the canvas in the programmed style.
 */
CanvasDrawing.prototype.brush = {

	cd: CanvasDrawing.prototype,
	
	/**
	 * Reset context to browser default values.
	 */
	reset: function() {
		this.cd.context.lineCap = "butt";
		this.cd.context.lineJoin = "miter";
		this.cd.context.shadowOffsetX = 0;
		this.cd.context.shadowOffsetY = 0;
		this.cd.context.shadowBlur = 0;
		this.cd.context.shadowColor = "transparent black";
		this.cd.context.globalAlpha = 1;
	},
	
	fill: function() {
		this.reset();
		this.cd.context.fillStyle = this.cd.options.color;
		this.cd.context.fillRect(0, 0, this.cd.canvas.width, this.cd.canvas.height);
	},
	
	/**
	 * Helper function for any solid line drawing brush (e.g. marker). 
	 * 
	 * The smooth brush code was mostly lifted from the ground breaking http://canvaspaint.org (http://canvaspaint.org/paint.js)
	 */
	drawLine: function(x, y) {
		
		var cd = this.cd,
			deltaX, deltaY, 
			delta2X, delta2Y,
			lx, ly;
		
		cd.context.beginPath();
		cd.context.moveTo(cd.oldX, cd.oldY);
		
		// smooth brush, a little more intensive
		if (cd.options.smoothBrush) {
			
			deltaX = Math.abs(x - cd.oldX);
			deltaY = Math.abs(y - cd.oldY);
			
			this.cp = { x: x, y: y }; //default: no bezier
				
			if (deltaX + deltaY > 10) {
			
				lx = (this.lastcp) ? this.lastcp.x : cd.oldX;
				ly = (this.lastcp) ? this.lastcp.y : cd.oldY;
				delta2X = cd.oldX - lx;
				delta2Y = cd.oldY - ly;
				
				this.cp = { x: lx + delta2X * 1.4, y: ly + delta2Y * 1.4 };
			}
			
			this.lastcp = { x: this.cp.x, y:this.cp.y };
			
			cd.context.bezierCurveTo(this.cp.x, this.cp.y, x, y, x, y); // smooth curve
				
		// slightly jerky brush, less intensive
		} else {
			cd.context.moveTo(cd.oldX, cd.oldY);
			cd.context.lineTo(x, y);
		}
		
		cd.context.stroke();
	},

	marker: function(x, y) {

		this.reset();
		
		var cd = this.cd;
		
		// setup brush
		cd.context.globalAlpha = 1;
		cd.context.lineCap = "round";
		
		// draw (TODO: move this into seperate method that can be shared with other line based brushes)			
		this.drawLine(x, y);
	},
	
	spray: function(x, y) {

		this.reset();

		// TODO: round brush

		var i, randX, randY, density = 3;
		
		for (i=0; i < this.cd.options.lineWidth * density; i++) {

			// the spray is split into four and outputted individually in order to
			// centre align the brush with the mouse pointer
			
			randX = Math.random() * this.cd.options.lineWidth / 2;
			randY = Math.random() * this.cd.options.lineWidth / 2;
			
			this.cd.context.fillRect(x - randX, y - randY, 1, 1); // top left
			this.cd.context.fillRect(x + randX, y - randY, 1, 1); // top right
			this.cd.context.fillRect(x - randX, y + randY, 1, 1); // bottom left
			this.cd.context.fillRect(x + randX, y + randY, 1, 1); // bottom right
		}
	}
};

/**
 * Pause drawing if the mouse is off the canvas
 */
CanvasDrawing.prototype.drawPause = function() {
	var cd = CanvasDrawing.prototype;
	if (cd.drawing) { cd.paused = true; }
};

/**
 * Resume drawing from the right position if the mouse comes back into the canvas
 */
CanvasDrawing.prototype.drawResume = function(x, y) {
	var cd = CanvasDrawing.prototype;
	if (cd.paused) {
		cd.oldX = x;
		cd.oldY = y;
	}
};

/**
 * Stop drawing
 */
CanvasDrawing.prototype.drawStop = function() {
	CanvasDrawing.prototype.drawing = false;
};

/**
 * Reset the canvas.
 */
CanvasDrawing.prototype.clearCanvas = function() {
	
	var cd = CanvasDrawing.prototype;
	
	cd.drawing = false;
	cd.context.globalAlpha = 1;
	cd.context.fillStyle = cd.options["background-color"];
	cd.context.fillRect(0, 0, cd.canvas.width, cd.canvas.height);
};

/**
 * Merge two arrays. Any properties in b will replace the same properties in
 * a. New properties from b will be added to a.
 * 
 * @param object {Object}
 */
Object.prototype.merge = function(object) {
	
	var prop, a = this, b = object;

	if (typeof b === "undefined") { b = {}; }

	for (prop in a) {
		if (a.hasOwnProperty(prop)) {
			if (prop in b) { continue; }
			b[prop] = a[prop];
		}
	}

	return b;
};

/**
 * Calculate the current mouse position relative to an element.
 *
 * Credit to Mark Pilgrim: http://www.diveintohtml5.org/canvas.html
 *
 * @return Cursor position coordinates
 */
MouseEvent.prototype.offset = function() {

	var x, y;

	// check if page relative positions exist, if not figure them out
	if (this.offsetX || this.offsetY) {
		x = this.offsetX;
		y = this.offsetY;
	} else {

		if (this.pageX || this.pageY) {
			x = this.pageX;
			y = this.pageY;
		} else {
			x = this.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = this.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		// make the position relative to the element
		x -= this.target.offsetLeft;
		y -= this.target.offsetTop;
	}
	
	return {"x": x, "y": y};
};

