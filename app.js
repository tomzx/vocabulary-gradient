// TODO: Add a distribution graph <tom@tomrochette.com>
// TODO: Basic statistics (min/max/average/median/stddev) <tom@tomrochette.com>

var dictionary = {};
for (var i = 0; i < wordFrequencies.length; ++i) {
	var word = wordFrequencies[i];
	dictionary[word] = i;
}

var clamp = function(value, minimum, maximum) {
	return Math.max(0, Math.min(1, value));
}

var colorScale = function(max) {
	var colors = [
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

	return function(value) {
		var ratio = clamp(value / max, 0, 1);
		var index = Math.floor(ratio * colors.length);
		return colors[index];
	};
};

var grayScale = colorScale(wordFrequencies.length);

var Statistics = function() {
	this.data = [];
};

Statistics.prototype.add = function(value) {
	this.data.push(value);
}

Statistics.prototype.min = function() {
	return Math.min.apply(Math, this.data);
};

Statistics.prototype.max = function() {
	return Math.max.apply(Math, this.data);
};

Statistics.prototype.average = function() {
	var sum = 0;
	for (var i in this.data) {
		sum += this.data[i];
	}
	return sum / this.data.length;
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
}

// TODO: Strip punctuation from words <tom@tomrochette.com>
var process = function() {
	var startTime = new Date().getTime();
	var statistics = new Statistics;
	var text = document.getElementById('text').value;

	var tokens = text.split(/(\n|\s)/);

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

		var processedToken = token.replace(/[.,-\/#!?$%\^&\*;:{}=\-_`~()"]/g, '');
		// TODO: Some of the words in the dictionary have uppercases, thus they'll never match <tom@tomrochette.com>
		processedToken = processedToken.toLowerCase();

		console.info('Searching for token "' + processedToken + '"');

		var dictionaryIndex = dictionary[processedToken] || null;
		var displayIndex = dictionaryIndex === null ? '?' : dictionaryIndex;
		var backgroundColor = dictionaryIndex === null ? '#FF0' : grayScale(dictionaryIndex);
		output.push('<span style="background: ' + backgroundColor + '">' + token + '</span>');
		output.push('<sub>' + displayIndex + '</sub> ');

		if (dictionaryIndex !== null) {
			statistics.add(dictionaryIndex);
		}
	}

	var processedText = document.getElementById('processed-text');
	processedText.innerHTML = output.join('');

	document.getElementById('min').innerHTML = statistics.min();
	document.getElementById('avg').innerHTML = Math.round(statistics.average());
	document.getElementById('max').innerHTML = statistics.max();
	document.getElementById('stddev').innerHTML = Math.round(statistics.stdDev());

	document.getElementById('processing-time').innerHTML = (new Date().getTime() - startTime) / 1000;
};
