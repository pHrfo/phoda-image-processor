var showAdaptative = function() {

	var adaptative = document.querySelector('.adaptative-container')
	var imageContainer = document.querySelector('.filter-container')
	Object.assign(adaptative.style,{display: "block"})
	Object.assign(document.querySelector('.enhancing-container').style,{display: "none"})
	Object.assign(document.querySelector('.histogram-container').style,{display:"none"});
	Object.assign(document.querySelector('.convolution-container').style,{display:"none"});
	Object.assign(document.querySelector(".frequency-container").style,{display:"none"})


	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	} 

	if (adaptative.classList.contains('hidden')){
		adaptative.classList.remove('hidden')
	}

}

var adaptativeNoiseReduction = function() {
	var img = genericFilter();
	var canv = document.querySelector(".canvas");
	var noiseVar = 100

	var n_img = genericFilter()

	var size = 7

	var kernelSizes = {}
	for (var y = 0; y < canv.height; y++) {
		for (var x = 0; x < canv.width; x++) {
		
			var index = ((canv.width * y) + x) * 4;

			var fKernel = computeResizeKernel(y,x,size,canv.width,canv.height);

			var mean = computeMean(img, fKernel)
			var vari = computeVariance(img, fKernel, mean)

			if((y==0)&&(x<3))
				console.log(mean, vari)

			n_img.data[index] = fHat(img.data[index], mean.r, vari.r, noiseVar)
			n_img.data[index + 1] = fHat(img.data[index + 1], mean.g, vari.g, noiseVar)
			n_img.data[index + 2] = fHat(img.data[index + 2], mean.b, vari.b, noiseVar)
		}
	}

	canv.getContext("2d").putImageData(n_img, 0, 0)
}

var fHat = function(pixel, mean, kernelVar, noiseVar){
	var ratio = noiseVar > kernelVar ? 1 : (noiseVar/kernelVar)
	return pixel - ratio*(pixel - mean)
}

var computeMean = function(img, pixels) {
	var mean = {r:0, g:0, b:0}
	for(var i = 0; i < pixels.length; i++){
		mean.r += img.data[pixels[i]]/pixels.length
		mean.g += img.data[pixels[i] + 1]/pixels.length
		mean.b += img.data[pixels[i] + 2]/pixels.length
	}

	return mean
}

var computeVariance = function(img, pixels, mean) {
	var vari = {r:0, g:0, b:0}
	for (var i = 0; i<pixels.length; i++) {
		vari.r += Math.pow(img.data[pixels[i]] - mean.r, 2)/pixels.length
		vari.g += Math.pow(img.data[pixels[i] + 1] - mean.g, 2)/pixels.length
		vari.b += Math.pow(img.data[pixels[i] + 2] - mean.b, 2)/pixels.length
	}

	return vari

}