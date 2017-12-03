var showMorphological = function () {
	var morphological = document.querySelector('.morphological-container')
	var imageContainer = document.querySelector('.filter-container')
	var histogramContainer = document.querySelector('.histogram-container')

	Object.assign(document.querySelector('.histogram-container').style,{display:"none"});
	Object.assign(document.querySelector('.enhancing-container').style,{display: "none"})
	Object.assign(document.querySelector('.convolution-container').style,{display:"none"});
	Object.assign(document.querySelector(".resize-container").style,{display:"none"});
	Object.assign(document.querySelector(".frequency-container").style,{display:"none"})
	Object.assign(document.querySelector(".adaptative-container").style,{display:"none"})
	Object.assign(document.querySelector('.color-model-container').style,{display:"none"})
	Object.assign(document.querySelector('.chroma-key-container').style,{display:"none"})
	Object.assign(document.querySelector('.shine-container').style,{display:"none"})
	Object.assign(document.querySelector('.haar-container').style,{display:"none"})
	// Object.assign(document.querySelector('.compression-container').style,{display:"none"})
	// Object.assign(document.querySelector('.morphological-container').style,{display:"block"})

	if (!histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.add('hidden')
		document.querySelector('.chart-div').classList.add('hidden')
	}

	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	}
	
	if(morphological.classList.contains('hidden')){
		morphological.classList.remove('hidden')
	}

var morphological_convolute = function(img, decide){
	let kernel = [
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0]
	]
	var imgAux = Array.prototype.slice.call(img.data);

	var kerneloffset = Math.floor(kernel.length / 2);
	
	var w = img.width;
	var h = img.height;
	//for each image row
	for (var row = 0; row < h; row++) {
		//for each pixel
		for (var col = 0; col < w; col++) {
			//below is the accumulator
			var result = 
			//for each kernel row
			for (var kRow = 0; kRow < kernel.length; kRow++) {
				//for each kernel value
				for (var kCol = 0; kCol < kernel[kRow].length; kCol++) {
					var kVal = kernel[kRow][kCol];
					
					var pixelRow = row + kRow - kerneloffset;
					var pixelCol = col + kCol - kerneloffset;

					//skip if the calculated pixel is not part of the image
					if (pixelRow < 0 || pixelRow >= h || pixelCol < 0 || pixelCol >= w) {
						continue;
					}
					//element position  corresponding to pixel position
					else{
						/*
						because img is a flatten array, we need calculate
						the position in which our data is.
						Multiplying the row by the width and summing with the column,
						we could find the field (row/column) where our pixel is, 
						but since our ImageData has 4 channel per "field", 
						we must multiply by 4. 
						Then we have the srcIndex.
						*/
						var srcIndex = (pixelRow * w + pixelCol) * 4;
						//var mean = (imgAux[srcIndex] + imgAux[srcIndex + 1] + imgAux[srcIndex + 2])/3 
						// multiplying element value corresponding to pixel value in its four channel 
						if(kVal == 1){
							result[0] = decide(result[0],imgAux[srcIndex]);
							result[1] = decide(result[1],imgAux[srcIndex + 1]);
							result[2] = decide(result[2],imgAux[srcIndex + 2]);
						}
					}
				}
			}
			//now result has the value of that pixel [row,col] in its four channels
			var dstIndex = (row * w + col) * 4;
			img.data[dstIndex] = result[0];
			img.data[dstIndex + 1] = result[1];
			img.data[dstIndex + 2] = result[2];
			
		}
	}
	return img
}

var erosion = function(){
	blackAndWhite();
	let img = genericFilter(true);
	img = morphological_convolute(img, Math.min);
}

var dilation = function(){
	blackAndWhite();
	let img = genericFilter(true);
	img = morphological_convolute(img, Math.max);
}

var edge = function(){

}