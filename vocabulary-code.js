// http://www.visualcinnamon.com/2015/11/learnings-from-a-d3-js-addict-on-starting-with-canvas.html
var width = 200;
var height = 200;
var pixelSize = 3;
var widthPixels = width*pixelSize;
var heightPixels = height*pixelSize;

var canvas  = d3.select("#chart").append("canvas")
.attr("id", "canvas")
.attr("width", widthPixels)
.attr("height", heightPixels)
.on('click', function() {
	var coordinates = d3.mouse(this);
	var x = Math.floor(coordinates[0] / pixelSize);
	var y = Math.floor(coordinates[1] / pixelSize);
	var word = wordFrequencies[y*width+x];
	console.log(x, y, word);

});

var context = canvas.node().getContext("2d");

var drawRectangle = function(x, y, w, h, color) {
	//Drawing a rectangle
	context.fillStyle = color;
	context.fillRect(x, y, w, h);
	//Optional if you also want to give the rectangle a stroke
	// context.strokeStyle = "black";
	// context.strokeRect(x, y, w, h);
};

var drawVocabularyCode = function(usedWords) {
	for (var i = 0; i < height; ++i) {
		for (var j = 0; j < width; ++j) {
			drawRectangle(j*pixelSize, i*pixelSize, pixelSize, pixelSize, usedWords[i*width+j] ? "black" : "white");
		}
	}
};
