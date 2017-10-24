function drawChart(data, div) {
	console.log(data)
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
		console.log(histogram)
		window.histogramData = histogram
		document.querySelector('.chart-div').innerHTML = ""
		drawChart(data, null)
	}
}

var rgbHistogram = function (plot) {
	plot = (plot == undefined ? true : plot)
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

			if (plot){
				document.querySelector('.chart-div').innerHTML = '<div class="c1"></div><div class="c2"></div><div class="c3"></div>'
				drawChart(dataRed, '.chart-div .c1')
				drawChart(dataGreen, '.chart-div .c2')
				drawChart(dataBlue, '.chart-div .c3')
			}

			else
				return [histogram["red"], histogram["green"], histogram["blue"]]
	}
}

var showHistogram = function () {
	window.opt = 2;
	var histogramContainer = document.querySelector('.histogram-container')
	var imageContainer = document.querySelector('.filter-container')

	Object.assign(document.querySelector('.histogram-container').style,{display:"block"});
	Object.assign(document.querySelector('.convolution-container').style,{display:"none"});
	Object.assign(document.querySelector('.enhancing-container').style,{display:"none"})
	Object.assign(document.querySelector(".resize-container").style,{display:"none"});
	Object.assign(document.querySelector(".frequency-container").style,{display:"none"})
	Object.assign(document.querySelector('.color-model-container').style,{display:"none"})
	Object.assign(document.querySelector('.chroma-key-container').style,{display:"none"})
	Object.assign(document.querySelector('.shine-container').style,{display:"none"})
	
	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
		document.querySelector('.canvas').classList.add("hidden")
	} 
	if (histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.remove('hidden')
	}

	greyHistogram()

}

var localHistogramEq = function() {

	var imgData = genericFilter(true)
	// var kerneloffset = Math.floor(document.getElementById('histkernelsize').value / 2);
	var kerneloffset = 1
	var w = imgData.width
	var h = imgData.height

	for(var i = 0; i < h; i++){
		for(var j = 0; j < w; j++){
			var fKernel = computePosition(i,j,w,h,kerneloffset)
			var kCenter = (i * w + j)*4
			var ijmean = Math.floor((imgData.data[kCenter]
					+ imgData.data[kCenter+1] +
					imgData.data[kCenter+2])/3)

			var means = []
			var eqHist = {}
			var freqs = {}
			var total = 0
			var acc = 0

			for(var k = 0; k < fKernel.length; k++){
				var mean = Math.floor((imgData.data[fKernel[k]]
					+ imgData.data[fKernel[k]+1] + imgData.data[fKernel[k]+2])/3)
				means.push(mean)
			}
			var orderedMeans = new Set(means)
			orderedMeans = Array.from(orderedMeans).sort((a, b) => a - b)

			for(var k = 0; k < means.length;k++){
				if(!freqs[means[k]]){
					freqs[means[k]] = 0
				}
				freqs[means[k]]++
				total++
			}

			for(var k = 0; k < orderedMeans.length;k++){
				freqs[orderedMeans[k]] = freqs[orderedMeans[k]]/total
			}

			for(var k = 0; k < orderedMeans.length;k++){
				acc += freqs[orderedMeans[k]]
				eqHist[orderedMeans[k]] = Math.floor(255*acc)
			}
			imgData.data[kCenter] = eqHist[ijmean]
			imgData.data[kCenter+1] = eqHist[ijmean]
			imgData.data[kCenter+2] = eqHist[ijmean]
		}
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
	document.querySelector('.chart-div').innerHTML = ""
}

var globalHistogramEq = function(histdata, clear) {
	var imgData = genericFilter(true)

	var hist = (histdata ? histdata : [window.histogramData])

	eqHists = []

	for (var j =0; j<hist.length; j++) {

		var total = 0
		for (var i=0; i<256; i++) {
			if (!hist[j][i])
				hist[j][i]=0

			total += hist[j][i]
		}

		for (var i=0; i<256; i++)
			hist[j][i] = hist[j][i]/total

		var eqHist = {}
		var acc = 0
		for (var i=0; i<256; i++) {
			acc += hist[j][i]
			eqHist[i] = Math.floor(255*acc)
		}

		eqHists.push(eqHist)
	}

	if (imgData) {
		var chartDataGrey = [["grey"]]
		var chartDataRed = [["red"]]
		var chartDataGreen = [["green"]]
		var chartDataBlue = [["blue"]]

		for (var i=0; i<imgData.data.length; i+=4) {
			
			if (hist.length == 3) {
				imgData.data[i] = Math.floor(eqHists[0][imgData.data[i]])
				imgData.data[i+1] = Math.floor(eqHists[1][imgData.data[i+1]])
				imgData.data[i+2] = Math.floor(eqHists[2][imgData.data[i+2]])
				
				chartDataRed.push([Math.floor(eqHists[0][imgData.data[i]])])
				chartDataGreen.push([Math.floor(eqHists[0][imgData.data[i+1]])])
				chartDataBlue.push([Math.floor(eqHists[0][imgData.data[i+2]])])
			} 
			else{
				var eqHist = eqHists[0]
				var mean = Math.floor((imgData.data[i] + imgData.data[i+1] + imgData.data[i+2])/3)
				
				imgData.data[i] = eqHist[mean]
				imgData.data[i+1] = eqHist[mean]
				imgData.data[i+2] = eqHist[mean]
				
				chartDataGrey.push([eqHist[mean]])
			}
		}


		document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
		
		if((clear != undefined)&&(clear))
			document.querySelector('.chart-div').innerHTML = ""
		
		if (hist.length == 3) {
			document.querySelector('.chart-div').innerHTML = '<div class="c1"></div><div class="c2"></div><div class="c3"></div>'
			drawChart(chartDataRed, '.chart-div .c1')
			drawChart(chartDataGreen, '.chart-div .c2')
			drawChart(chartDataBlue, '.chart-div .c3')
		}
		else {
			drawChart(chartDataGrey)
		}
		
	}
}


var globalHistogramEqRGB = function() {
	rgbhist = rgbHistogram(false)

	globalHistogramEq(rgbhist, true)


}