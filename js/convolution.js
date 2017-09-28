var showConvolution = function(){
	window.opt = 3;
	var conv = document.querySelector('.convolution-container')
	var imageContainer = document.querySelector('.filter-container')
	var histogramContainer = document.querySelector('.histogram-container')

	Object.assign(document.querySelector('.histogram-container').style,{display:"none"});
	Object.assign(document.querySelector('.enhancing-container').style,{display: "none"})
	Object.assign(document.querySelector('.convolution-container').style,{display:"block"});
	
	if (!histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.add('hidden')
		document.querySelector('.chart-div').classList.add('hidden')
	}

	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	}
	
	if(conv.classList.contains('hidden')){
		conv.classList.remove('hidden')
	}

};

var showResize = function(){
	window.opt = 2;
	var resizeContainer = document.querySelector('.resize-container')
	var imageContainer = document.querySelector('.filter-container')
	Object.assign(resizeContainer.style,{display: "block"})
	Object.assign(document.querySelector('.enhancing-container').style,{display: "none"})
	Object.assign(document.querySelector('.histogram-container').style,{display:"none"});
	Object.assign(document.querySelector('.convolution-container').style,{display:"none"});


	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	} 

	if (resizeContainer.classList.contains('hidden')){
		resizeContainer.classList.remove('hidden')
	}

}

var showEnhancing = function () {
	window.opt = 2;
	var enhancingContainer = document.querySelector('.enhancing-container')
	var imageContainer = document.querySelector('.filter-container')

	Object.assign(document.querySelector('.enhancing-container').style,{display: "block"})
	Object.assign(document.querySelector('.histogram-container').style,{display:"none"});
	Object.assign(document.querySelector('.convolution-container').style,{display:"none"});
	
	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	} 

	if (enhancingContainer.classList.contains('hidden')){
		enhancingContainer.classList.remove('hidden')
	}

}


var resize_img = function(){
	var size = document.getElementById('down_size').valueAsNumber;
	var useMedian = document.getElementById('resize_median').checked;
	var img = genericFilter();

	var columns = Math.floor(img.width/size);
	var rows = Math.floor(img.height/size);

	var canvas = document.createElement('canvas');
	var n_img = canvas.getContext("2d").createImageData(columns, rows);

	for(var y = 0; y < rows; y+=size) {
		// loop through each column
		for(var x = 0; x < columns; x+=size) {
			var index = ((columns * y) + x) * 4;
			n_img.data[index] = img.data[((columns * y) + x) * 4];
			n_img.data[index + 1] = img.data[index + 1];
			n_img.data[index + 2] = img.data[index + 2];
		}
	}
	document.querySelector(".canvas").getContext("2d").putImageData(n_img, 0, 0);
}


var makeTable = function(){
	var value = document.getElementById('convksize').value
	if (value % 2 == 1){
		var matrix = document.querySelector('.conv_matrix');
		matrix.innerHTML = "";
		matrix.classList.add("convinputmatrix")
		
		for(var i = 0; i < value; i++){
			var row = matrix.insertRow(i);

			for(var j = 0; j < value; j++){
				var cell = row.insertCell(j);
				var t = document.createElement("input");
				t.setAttribute("type", "number");
				t.setAttribute("value", "1");
				t.classList.add("convinput")

				cell.appendChild(t);
			}	
		} 
		document.querySelector(".applyconv").classList.remove("hidden")
	} 
}

var tableToArray = function () {
	var value = document.getElementById('convksize').value
	if (value % 2 == 1){
		var table = document.querySelector('.conv_matrix');
		var tableArr = [];

		for ( var i = 0; i < value; i++ ) {
			tableArr.push([]);

			for (var j = 0; j < value; j++){
				tableArr[i].push(table.rows[i].cells[j].children[0].value);
			}
		}
		return tableArr;
	}
};

var convolute = function(kernel, divisor, offset, returnBool){
	var img = genericFilter();

	var imgAux = Array.prototype.slice.call(img.data)
	// var kernel = [
 //				[0, 0, -1, 0, 0],
 //				[0, 0, -2, 0, 0],
 //				[-1, -2, 9, 0, 0],
 //				[0, 0, 0, 0, 0],
 //				[0, 0, 0, 0, 0],
 //				]
	kernel = typeof kernel !== 'undefined' ? kernel : tableToArray();
	divisor = typeof divisor !== 'undefined' ? divisor : document.getElementById("convdivisor").value;
	divisor = Number(divisor) //+ 0.0000001

	offset = typeof offset !== 'undefined' ? offset : document.getElementById("convoffset").value;
	//the kerneloffset variable represents the center of the kernel
	var kerneloffset = Math.floor(kernel.length / 2);
	
	var w = img.width;
	var h = img.height;
	var count = 0
	//for each image row
	for (var row = 0; row < h; row++) {
		//for each pixel
		count++;
		for (var col = 0; col < w; col++) {
			//below is the accumulator
			var result = [0, 0, 0];
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
						
						result[0] += imgAux[srcIndex] * kVal;
						result[1] += imgAux[srcIndex + 1] * kVal;
						result[2] += imgAux[srcIndex + 2] * kVal;
					}
				}
			}
			//now result has the value of that pixel [row,col] in its four channels
			var dstIndex = (row * w + col) * 4;
			img.data[dstIndex] = result[0] / divisor + offset;
			img.data[dstIndex + 1] = result[1] / divisor + offset;
			img.data[dstIndex + 2] = result[2] / divisor + offset;
			
		}
	}
	returnBool = typeof returnBool !== 'undefined' ? returnBool : false
	if (returnBool) {
		return img
	}

	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
};

var computePosition = function(i,j,w,h,kerneloffset){
	var fKernel = []

	for(var k = i - kerneloffset; k <= i + kerneloffset; k++){
		if(k >= 0 && k < h){
			for(var l = j - kerneloffset; l <= j + kerneloffset; l++){
				if(l >= 0 && l < w){
					fKernel.push((k * w + l) * 4);
				}
			}
		}
	}
	return fKernel;
}

var computeMedian = function(img,fKernel){
	var values = {r:[], g:[], b:[]}
	for(var i = 0; i < fKernel.length; i++){
		values.r.push(img.data[fKernel[i]])
		values.g.push(img.data[fKernel[i] + 1])
		values.b.push(img.data[fKernel[i] + 2])
	}

	values.r = values.r.sort((a, b) => a - b);
	values.g = values.g.sort((a, b) => a - b);
	values.b = values.b.sort((a, b) => a - b);

	var mr = values.r[(values.r.length - 1 )/2]
	var mg = values.g[(values.g.length - 1 )/2]
	var mb = values.b[(values.b.length - 1 )/2]

	return [mr, mg, mb]
}

var medianFilter = function(){
	var kerneloffset = Math.floor(document.getElementById('convksize').value / 2);
	var img = genericFilter();
	var w = img.width
	var h = img.height

	for (var i = 0; i< h; i++){
		for (var j = 0; j < w; j++){
			var fKernel = computePosition(i, j, w, h, kerneloffset);
			
			var median = computeMedian(img,fKernel)
			var kCenter = (i * w + j) * 4

			img.data[kCenter] = median[0]
			img.data[kCenter + 1] = median[1]
			img.data[kCenter + 2] = median[2]
		}
	}
	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
}

var laplacian = function() {
	var kernel = [
		[0, -1, 0],
		[-1, 4, -1],
		[0, -1, 0]
	]

	var img = genericFilter(true)
	var divisor = 1
	var offset = 0

	var enhancedBorders = convolute(kernel, divisor, offset, true)

	for (var i = 0; i < img.data.length; i += 4) {
		img.data[i] += enhancedBorders.data[i]
		img.data[i+1] += enhancedBorders.data[i+1]
		img.data[i+2] += enhancedBorders.data[i+2]
	}

	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
}

var highboost = function() {
	var c = 1.5

	var kernel = [
		[0, -1*c, 0],
		[-1*c, 4*c, -1*c],
		[0, -1*c, 0]
	]

	var img = genericFilter(true)
	var divisor = 1
	var offset = 0

	var enhancedBorders = convolute(kernel, divisor, offset, true)

	for (var i = 0; i < img.data.length; i += 4) {
		img.data[i] += enhancedBorders.data[i]
		img.data[i+1] += enhancedBorders.data[i+1]
		img.data[i+2] += enhancedBorders.data[i+2]
	}

	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
}

var sobel = function() {
	var hkernel = [
		[-1, -2, -1],
		[0, 0, 0],
		[1, 2, 1]
	]

	var img = genericFilter(true)
	var divisor = 1
	var offset = 0

	var horizontalBorders = convolute(hkernel, divisor, offset, true)

	var vkernel = [
		[-1, 0, 1],
		[-2, 0, 2],
		[-1, 0, 1]
	]

	var verticalBorders = convolute(vkernel, divisor, offset, true)

	for (var i = 0; i < img.data.length; i += 4) {
		img.data[i] += horizontalBorders.data[i] + verticalBorders.data[i]
		img.data[i+1] += horizontalBorders.data[i+1] + verticalBorders.data[i+1]
		img.data[i+2] += horizontalBorders.data[i+2] + verticalBorders.data[i+2]
	}

	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
}
