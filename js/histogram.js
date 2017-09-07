function drawChart(data, div) {
	var location = (div ? div : '.chart-div')
	google.charts.load("current", {packages:["corechart"]});
	google.charts.setOnLoadCallback(function() {
		var googleData = google.visualization.arrayToDataTable(data);

		var options = {
			title: 'Frequency of shades',
			
			histogram: {
				bucketSize: 1,
				maxNumBuckets: 255,
				minValue: 0,
				maxValue: 255
			},

			chartArea: { width: 401 },
			hAxis: {
				ticks: [0, 50, 100, 150, 200, 250]
			},
			bar: { gap: 0 },
			colors: data[0]
		};

		document.querySelector('.chart-div').classList.remove('hidden')
		var chart = new google.visualization.Histogram(document.querySelector(location));

		chart.draw(googleData, options);
	})
	
}

var greyHistogram = function () {
	
	img = document.querySelector(".image-container .img")

	if (img.src){
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext("2d")

		ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
		
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

		var data = [["grey"]]
		var histogram = {}
		for (var i = 0; i < imageData.data.length; i += 4) {
			var mean = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2])/3
			if (!histogram[Math.floor(mean)])
				histogram[Math.floor(mean)] = 0
			histogram[Math.floor(mean)] += 1

			data.push([Math.floor(mean)])
		}
		window.histogramData = histogram
		drawChart(data, null)
	}
}

var rgbHistogram = function () {
	img = document.querySelector(".image-container .img")

	if (img.src){
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext("2d")

		ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
		
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

		var dataRed = [["red"]]
		var dataGreen = [["green"]]
		var dataBlue = [["blue"]]


		var histogram = {"red": {}, "green": {}, "blue": {}}
		for (var i = 0; i < imageData.data.length; i += 4) {
			
			if (!histogram["red"][imageData.data[i]])
				histogram["red"][imageData.data[i]] = 0
			histogram["red"][imageData.data[i]] += 1

			if (!histogram["green"][imageData.data[i+1]])
				histogram["green"][imageData.data[i+1]] = 0
			histogram["green"][imageData.data[i+1]] += 1

			if (!histogram["blue"][imageData.data[i+2]])
				histogram["blue"][imageData.data[i+2]] = 0
			histogram["blue"][imageData.data[i+2]] += 1

			dataRed.push([Math.floor(imageData.data[i])])
			dataGreen.push([Math.floor(imageData.data[i+1])])
			dataBlue.push([Math.floor(imageData.data[i+2])])

		}

		document.querySelector('.chart-div').innerHTML = '<div class="c1"></div><div class="c2"></div><div class="c3"></div>'
		drawChart(dataRed, '.chart-div .c1')
		drawChart(dataGreen, '.chart-div .c2')
		drawChart(dataBlue, '.chart-div .c3')
	}
}

var showHistogram = function () {
	window.opt = 2;
	var histogramContainer = document.querySelector('.histogram-container')
	var imageContainer = document.querySelector('.filter-container')

	Object.assign(document.querySelector('.histogram-container').style,{display:"block"});

	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
		document.querySelector('.canvas').classList.add("hidden")
	} 
	if (histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.remove('hidden')
	}

	greyHistogram()

}


var globalHistogramEq = function() {
	var imgData = genericFilter()
	var hist = window.histogramData
	var total = 0
	for (var i=0; i<256; i++) {
		if (!hist[i])
			hist[i]=0

		total += hist[i]
	}

	for (var i=0; i<256; i++)
		hist[i] = hist[i]/total

	var eqHist = {}
	var acc = 0
	for (var i=0; i<256; i++) {
		acc += hist[i]
		eqHist[i] = Math.floor(255*acc)
	}

	if (imgData) {
		var chartData = [["grey"]]

		for (var i=0; i<imgData.data.length; i+=4) {
			var mean = Math.floor((imgData.data[i] + imgData.data[i+1] + imgData.data[i+2])/3)
			
			imgData.data[i] = eqHist[mean]
			imgData.data[i+1] = eqHist[mean]
			imgData.data[i+2] = eqHist[mean]

			chartData.push([eqHist[mean]])
		}

		document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
		document.querySelector('.chart-div').innerHTML = ""
		drawChart(chartData, null)
	}
}