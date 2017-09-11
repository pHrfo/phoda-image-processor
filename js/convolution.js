var showConvolution = function(){
	window.opt = 3;
	var conv = document.querySelector('.convolution-container')
	var imageContainer = document.querySelector('.filter-container')
	var histogramContainer = document.querySelector('.histogram-container')

	Object.assign(document.querySelector('.histogram-container').style,{display:"none"});
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


var makeTable = function(){
	var value = document.getElementById('convksize').value
	if (value % 2 == 1){
		var matrix = document.querySelector('.conv_matrix');
		matrix.innerHTML = "";
		
		for(var i = 0; i < value; i++){
			var row = matrix.insertRow(i);

			for(var j = 0; j < value; j++){
				var cell = row.insertCell(j);
				var t = document.createElement("input");
				t.setAttribute("type", "number");
				t.setAttribute("value", "1");

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

var convolute = function(){
	var img = genericFilter();
	// var kernel = [
 //                [0, 0, -1, 0, 0],
 //                [0, 0, -2, 0, 0],
 //                [-1, -2, 9, 0, 0],
 //                [0, 0, 0, 0, 0],
 //                [0, 0, 0, 0, 0],
 //            	]
	var kernel = tableToArray();
	var divisor = document.getElementById("convdivisor").value;
	var offset = document.getElementById("convoffset").value;
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
                    	// multiplying element value corresponding to pixel value in its four channel 
                    	
                    	result[0] += img.data[srcIndex] * kVal;
                    	result[1] += img.data[srcIndex + 1] * kVal;
                    	result[2] += img.data[srcIndex + 2] * kVal;
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
    document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
};

var computePosition = function(i,j,w,h,kerneloffset){
	var fKernel = []

	for(var k = i - kerneloffset; k <= i + kerneloffset; k++){
		if(k >= 0 && k < w){
			for(var l = j - kerneloffset; l <= j + kerneloffset; l++){
				if(l >= 0 && l < h){
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

	for (var i = 0; i< w; i++){
		for (var j = 0; j < h; j++){
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
