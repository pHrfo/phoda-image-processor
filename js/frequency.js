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

var arithmeticMean = function(img,kerneloffset,m,n){
	var w = img.width
	var h = img.height

	for (var i = 0; i< h; i++){
		for (var j = 0; j < w; j++){
			var means = {r:0, g:0, b:0}
			var fKernel = computePosition(i, j, w, h, kerneloffset);
			
			for(var k = 0; k < fKernel.length; k++){
				means.r += img.data[fKernel[k]]
				means.g += img.data[fKernel[k] + 1]
				means.b += img.data[fKernel[k] + 2]
			}
			var kCenter = (i * w + j) * 4

			img.data[kCenter] = means.r/(m*n);
			img.data[kCenter + 1] = means.g/(m*n);
			img.data[kCenter + 2] = means.b/(m*n);
		}
	}

	return img;
}

var harmonicMean = function(img,kerneloffset,m,n){
	var w = img.width
	var h = img.height

	for (var i = 0; i< h; i++){
		for (var j = 0; j < w; j++){
			var means = {r:0, g:0, b:0}
			var fKernel = computePosition(i, j, w, h, kerneloffset);
			
			for(var k = 0; k < fKernel.length; k++){
				means.r += 1/img.data[fKernel[k]]
				means.g += 1/img.data[fKernel[k] + 1]
				means.b += 1/img.data[fKernel[k] + 2]
			}
			var kCenter = (i * w + j) * 4

			img.data[kCenter] = (m*n)/means.r;
			img.data[kCenter + 1] = (m*n)/means.g;
			img.data[kCenter + 2] = (m*n)/means.b;
		}
	}
	return img;
}

var geometricMean = function(img,kerneloffset,m,n){
	var w = img.width
	var h = img.height
	for (var i = 0; i< h; i++){
		for (var j = 0; j < w; j++){
			var means = {r:1, g:1, b:1}
			var fKernel = computePosition(i, j, w, h, kerneloffset);
			
			for(var k = 0; k < fKernel.length; k++){
				means.r *= img.data[fKernel[k]]
				means.g *= img.data[fKernel[k] + 1]
				means.b *= img.data[fKernel[k] + 2]
			}
			var kCenter = (i * w + j) * 4
			img.data[kCenter] = Math.pow(means.r,1/(m*n));
			img.data[kCenter + 1] = Math.pow(means.g,1/(m*n));
			img.data[kCenter + 2] = Math.pow(means.b,1/(m*n));
		}
	}
	return img;
}

var charmonicMean = function(img,kerneloffset,q){
	var w = img.width
	var h = img.height
	for (var i = 0; i< h; i++){
		for (var j = 0; j < w; j++){
			var means_q =  {r:0, g:0, b:0}
			var means_q1 =  {r:0, g:0, b:0}
			var fKernel = computePosition(i, j, w, h, kerneloffset);
			var kCenter = (i * w + j) * 4

			for(var k = 0; k < fKernel.length; k++){
				means_q.r += Math.pow(img.data[fKernel[k]],q)
				means_q.g += Math.pow(img.data[fKernel[k] + 1],q)
				means_q.b += Math.pow(img.data[fKernel[k] + 2],q)

				means_q1.r += Math.pow(img.data[fKernel[k]],q+1)
				means_q1.g += Math.pow(img.data[fKernel[k] + 1],q+1)
				means_q1.b += Math.pow(img.data[fKernel[k] + 2],q+1)
			}

			img.data[kCenter] = means_q1.r / means_q.r
			img.data[kCenter + 1] = means_q1.g / means_q.g
			img.data[kCenter + 2] = means_q1.b / means_q.b
		}
	}
	return img;
}

var Max = function(img,kerneloffset,m,n){
	var w = img.width
	var h = img.height
	for (var i = 0; i< h; i++){
		for (var j = 0; j < w; j++){
			var means = {r:0, g:0, b:0}
			var fKernel = computePosition(i, j, w, h, kerneloffset);
			
			for(var k = 0; k < fKernel.length; k++){
				if(means.r < img.data[fKernel[k]])
					means.r = img.data[fKernel[k]]
				
				if(means.g < img.data[fKernel[k] + 1])
					means.g = img.data[fKernel[k] + 1]
				
				if(means.b < img.data[fKernel[k] + 2])
					means.b = img.data[fKernel[k] + 2]

			}

			var kCenter = (i * w + j) * 4

			img.data[kCenter] = means.r;
			img.data[kCenter + 1] = means.g;
			img.data[kCenter + 2] = means.b;
		}
	}

	return img;
}

var Min = function(img,kerneloffset,m,n){
	var w = img.width
	var h = img.height

	for (var i = 0; i< h; i++){
		for (var j = 0; j < w; j++){
			var means = {r:255, g:255, b:255}
			var fKernel = computePosition(i, j, w, h, kerneloffset);
			
			for(var k = 0; k < fKernel.length; k++){
				if(means.r > img.data[fKernel[k]])
					means.r = img.data[fKernel[k]]
				
				if(means.g > img.data[fKernel[k] + 1])
					means.g = img.data[fKernel[k] + 1]
				
				if(means.b > img.data[fKernel[k] + 2])
					means.b = img.data[fKernel[k] + 2]

			}
			
			var kCenter = (i * w + j) * 4

			img.data[kCenter] = means.r;
			img.data[kCenter + 1] = means.g;
			img.data[kCenter + 2] = means.b;
		}
	}

	return img;
}

var midPoint = function(img,kerneloffset,m,n){
	var w = img.width
	var h = img.height

	for (var i = 0; i< h; i++){
		for (var j = 0; j < w; j++){
			var min = {r:255, g:255, b:255};
			var max = {r:0, g:0, b:0};

			var fKernel = computePosition(i, j, w, h, kerneloffset);
			
			for(var k = 0; k < fKernel.length; k++){
				if(mkn.r > img.data[fKernel[k]])
					mkn.r = img.data[fKernel[k]]
				
				if(mkn.g > img.data[fKernel[k] + 1])
					mkn.g = img.data[fKernel[k] + 1]
				
				if(mkn.b > img.data[fKernel[k] + 2])
					mkn.b = img.data[fKernel[k] + 2]

				if(max.r < img.data[fKernel[k]])
					max.r = img.data[fKernel[k]]
				
				if(max.g < img.data[fKernel[k] + 1])
					max.g = img.data[fKernel[k] + 1]
				
				if(max.b < img.data[fKernel[k] + 2])
					max.b = img.data[fKernel[k] + 2]

			}
			
			var kCenter = (i * w + j) * 4

			img.data[kCenter] = (1/2)*(min.r + max.r);
			img.data[kCenter + 1] = (1/2)*(min.g + max.g);
			img.data[kCenter + 2] = (1/2)*(min.b + min.b);
		}
	}

	return img;
}

var alphaTrimmedMean = function(img,kerneloffset,m,n,d){
	var w = img.width
	var h = img.height

	for (var i = 0; i< h; i++){
		for (var j = 0; j < w; j++){
			var means = {r:0, g:0, b:0}
			var fKernel = computePosition(i, j, w, h, kerneloffset);

			for(var k = 0; k < fKernel.length; k++){
				means.r += img.data[fKernel[k]]
				means.g += img.data[fKernel[k] + 1]
				means.b += img.data[fKernel[k] + 2]
			}
			var kCenter = (i * w + j) * 4

			img.data[kCenter] = means.r/((m*n)-d);
			img.data[kCenter + 1] = means.g/((m*n)-d);
			img.data[kCenter + 2] = means.b/((m*n)-d);
		}
	}

	return img;
}

var meanFilters = function(){
	var radios = document.getElementsByName("meanFilter");
	var meanop = undefined;
	var w = document.getElementById("w_value").value;

	var kerneloffset = Math.floor(w/2);
	var img = genericFilter();

	for(var i = 0; i < radios.length; i++){
		if(radios[i].checked == true){
			meanop = +radios[i].value
			break;
		}
	}
	switch(meanop) {
	    case 0:
	        img = arithmeticMean(img,kerneloffset,w,w);
	        break;
	    case 1:
	       	img = harmonicMean(img,kerneloffset,w,w);
	        break;
	    case 2:
	       	img = geometricMean(img,kerneloffset,w,w);
	        break;
	    case 3:
	    	var q = document.getElementById("q_value").value;
	       	img = charmonicMean(img,kerneloffset,q);
	        break;
	    case 4:
	       	img = Max(img,kerneloffset,w,w);
	        break;
	    case 5:
	       	img = Min(img,kerneloffset,w,w);
	        break;
	    case 6:
	       	img = midPoint(img,kerneloffset,w,w);
	        break;
	    case 7:
	    	var d = document.getElementById("d_value").value;
	       	img = alphaTrimmedMean(img,kerneloffset,w,w,d);
	        break;
	    default:
	}
	// console.log(img.data.length)
	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0);
}