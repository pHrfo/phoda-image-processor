var showFFilters = function(){
	Object.assign(document.querySelector('.histogram-container').style,{display:"none"});
	Object.assign(document.querySelector('.convolution-container').style,{display:"none"});
	Object.assign(document.querySelector('.enhancing-container').style,{display:"none"});
	Object.assign(document.querySelector(".resize-container").style,{display:"none"});
	Object.assign(document.querySelector(".frequency-container").style,{display:"block"})
	

	var freq = document.querySelector('.frequency-container')
	var imageContainer = document.querySelector('.filter-container')
	var histogramContainer = document.querySelector('.histogram-container')

	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	}

	if(freq.classList.contains('hidden')){
		freq.classList.remove('hidden')
	}
}

var lowpass = function() {
	var kernel = [
		[1, 4, 7, 4, 1],
		[4, 16, 26, 16, 4],
		[7, 26, 41, 26, 7],
		[4, 16, 26, 16, 4],
		[1, 4, 7, 4, 1]
	]

	var divisor = 273
	var offset = 0

	var lowpassed = convolute(kernel, divisor, offset, true)

	document.querySelector(".canvas").getContext("2d").putImageData(lowpassed, 0, 0)
}

var highpass = function() {

	var kernel = [
		[-1,-1,-1],
		[-1, 8,-1],
		[-1,-1,-1]
	]
	var divisor = 1
	var offset = 0

	var highpassed = convolute(kernel, divisor, offset, true)

	document.querySelector(".canvas").getContext("2d").putImageData(highpassed, 0, 0)

}

var bandreject = function() {
	var kernel = [
		[-1,-1,-1],
		[-1, 8,-1],
		[-1,-1,-1]
	]
	var divisor = 1
	var offset = 0

	var highpassed = convolute(kernel, divisor, offset, true)

	kernel = [
		[1, 4, 7, 4, 1],
		[4, 16, 26, 16, 4],
		[7, 26, 41, 26, 7],
		[4, 16, 26, 16, 4],
		[1, 4, 7, 4, 1]
	]

	divisor = 273
	offset = 0

	var lowpassed = convolute(kernel, divisor, offset, true)

	var img = genericFilter(true)

	for (var i = 0; i < img.data.length; i += 4) {
		img.data[i] = lowpassed.data[i] + highpassed.data[i]
		img.data[i+1] = lowpassed.data[i+1] + highpassed.data[i+1]
		img.data[i+2] = lowpassed.data[i+2] + highpassed.data[i+2]
	}

	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
}

var bandpass = function() {
	var kernel = [
		[1, 4, 7, 4, 1],
		[4, 16, 26, 16, 4],
		[7, 26, 41, 26, 7],
		[4, 16, 26, 16, 4],
		[1, 4, 7, 4, 1]
	]

	var divisor = 273
	var offset = 0

	var lowpassed = convolute(kernel, divisor, offset, true)

	var kernel = [
		[-1,-1,-1],
		[-1, 8,-1],
		[-1,-1,-1]
	]
	var divisor = 1
	var offset = 0

	var highpassed = convolute(kernel, divisor, offset, true, lowpassed)

	document.querySelector(".canvas").getContext("2d").putImageData(highpassed, 0, 0)
}