if(typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	}
}

var clamp = function(value, minimum, maximum) {
	return Math.max(0, Math.min(1, value));
}

var colorScale = function(colors, max) {
	return function(value) {
		var ratio = clamp(value / max, 0, 1);
		var index = Math.floor(ratio * colors.length);
		return colors[index];
	};
};

var grayScaleValues = [
	'#FFF',
	'#EEE',
	'#DDD',
	'#CCC',
	'#BBB',
	'#AAA',
	'#999',
	'#888',
	'#777',
	'#666',
	'#555',
	'#444',
	'#333',
	'#222',
	'#111',
	'#000',
];

var grayScale = colorScale(grayScaleValues, wordFrequencies.length);

var fontScaleValues = [
	'#000',
	'#FFF',
];

var fontScale = colorScale(fontScaleValues, wordFrequencies.length);

var Statistics = function() {
	this.data = [];
};

Statistics.prototype.add = function(value) {
	this.data.push(value);

	return this;
};

Statistics.prototype.count = function() {
	return this.data.length;
};

Statistics.prototype.min = function() {
	var length = this.data.length;
	var min = Infinity;
	while (length--) {
		if (this.data[length] < min) {
			min = this.data[length];
		}
	}
	return min;
};

Statistics.prototype.max = function() {
	var length = this.data.length;
	var max = -Infinity;
	while (length--) {
		if (this.data[length] > max) {
			max = this.data[length];
		}
	}
	return max;
};

Statistics.prototype.average = function() {
	if (this.data.length === 0) {
		return 0;
	}
	var sum = new Big(0);
	for (var i  = 0; i < this.data.length; ++i) {
		sum = sum.plus(this.data[i]);
	}
	return sum.div(this.data.length);
};

Statistics.prototype.median = function() {
	var sortedData = this.data.sort(function (a, b) { return a - b; });
	var lengthIsEven = (this.data.length & 1) === 0;
	if (lengthIsEven) {
		return (sortedData[this.data.length/2 - 1] + sortedData[this.data.length/2]) / 2;
	} else {
		return sortedData[(this.data.length-1)/2];
	}
};

Statistics.prototype.variance = function() {
	var average = this.average();
	var sum = 0;
	for (var i in this.data) {
		var diff = this.data[i] - average;
		sum += diff * diff;
	}
	return sum / this.data.length;
};

Statistics.prototype.stdDev = function() {
	var variance = this.variance();
	return Math.sqrt(variance);
};

var htmlEncode = function(text) {
	var container = document.createElement('div');
	var textElement = document.createTextNode(text);
	container.appendChild(textElement);
	return container.innerHTML;
};

var computeFingerprint = function(data) {
	var length = data.length;
	var count = 0;
	var currentSymbol = null;
	var output = '';
	for (var i = 0; i < length; ++i) {
		if (data[i] === currentSymbol) {
			++count;
		} else {
			if (currentSymbol !== null) {
				output += count + (currentSymbol ? "t" : "f");
			}
			count = 1;
		}
		currentSymbol = data[i];
	}

	if (currentSymbol !== null) {
		output += count + (currentSymbol ? "t" : "f");
	}

	return output;
};

var prettyPrintFingerprint = function(fingerprint) {
	var length = fingerprint.length;
	var charactersPerLine = 80;
	var output = '';
	for (var i = 0; i < length; i += charactersPerLine) {
		output += fingerprint.substr(i, charactersPerLine) + '<br/>';
	}
	return output;
};

var dictionary = {};
for (var i = 0; i < wordFrequencies.length; ++i) {
	var word = wordFrequencies[i];
	dictionary[word] = i;
}

google.charts.load("current", {packages:["corechart"]});

// TODO: Strip punctuation from words <tom@tomrochette.com>
var process = function() {
	var startTime = new Date().getTime();
	var statistics = new Statistics;
	var histogramData = {};
	var text = document.getElementById('text').value;

	var tokens = text.split(/(\n|\s)/);

	var usedWords = [];
	for (var i = 0; i < wordFrequencies.length; ++i) {
		usedWords.push(false);
	}
	var wordCount = 0;

	var output = [];
	for (var i in tokens) {
		var token = tokens[i];
		var trimmedToken = token.trim();

		if (token !== '\n' && trimmedToken === '') {
			continue;
		}

		if (token === '\n') {
			output.push('<br/>');
			continue;
		}

		var processedToken = token.replace(/[.,\-\/#!?$%\^&\*;:{}=\-_`~\(\)\[\]"]/g, '');
		// TODO: Some of the words in the dictionary have uppercases, thus they'll never match <tom@tomrochette.com>
		processedToken = processedToken.toLowerCase();

		var dictionaryIndex = dictionary.hasOwnProperty(processedToken) ? dictionary[processedToken] : null;
		usedWords[dictionaryIndex] = true;
		var displayIndex = dictionaryIndex === null ? '?' : dictionaryIndex;
		var backgroundColor = dictionaryIndex === null ? '#FF0' : grayScale(dictionaryIndex);
		var foregroundColor = dictionaryIndex === null ? '#000' : fontScale(dictionaryIndex);
		output.push('<span style="background: ' + backgroundColor + '; color: ' + foregroundColor + '">' + htmlEncode(token) + '</span>');
		output.push('<sub>' + displayIndex + '</sub> ');

		if (dictionaryIndex !== null) {
			statistics.add(dictionaryIndex);
			histogramData[processedToken] = dictionary[processedToken];
			++wordCount;
		}
	}

	var processedText = document.getElementById('processed-text');
	processedText.innerHTML = output.join('');

	document.getElementById('min').innerHTML = statistics.min();
	document.getElementById('avg').innerHTML = Math.round(statistics.average());
	document.getElementById('med').innerHTML = Math.round(statistics.median());
	document.getElementById('max').innerHTML = statistics.max();
	document.getElementById('stddev').innerHTML = Math.round(statistics.stdDev());
	document.getElementById('word-count').innerHTML = wordCount;
	document.getElementById('unique-word-count').innerHTML = usedWords.filter(function(value) { return value; }).reduce(function(a, b) { return a + b; }, 0);
	document.getElementById('fingerprint').innerHTML = prettyPrintFingerprint(computeFingerprint(usedWords));

	document.getElementById('processing-time').innerHTML = (new Date().getTime() - startTime) / 1000;
	drawVocabularyCode(usedWords);

	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var data = [['Index', 'Index']];
		for (var token in histogramData) {
			var dictionaryIndex = histogramData[token];
			data.push([token, dictionaryIndex]);
		}
		data = google.visualization.arrayToDataTable(data);

		var options = {
			title: 'Index of used words, lower = more frequent',
			legend: { position: 'none' },
		};

		var chart = new google.visualization.Histogram(document.getElementById('distribution'));
		chart.draw(data, options);
	}
};
