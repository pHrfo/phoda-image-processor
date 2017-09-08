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
	var value = document.getElementById('kernelSize').value
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
	var value = document.getElementById('kernelSize').value
	if (value % 2 == 1){
		var table = document.querySelector('.conv_matrix');
		var tableArr = [];

		for ( var i = 0; i < value; i++ ) {
			tableArr.push([]);

			for (var j = 0; j < value; j++){
				tableArr[i].push(parseFloat(table.rows[i].cells[j].children[0].value));
			}
		}
		return tableArr;
	}
};

var convolute = function(){
	var img = genericFilter();

	var kernel = tableToArray();
	var divisor = document.getElementById("convdivisor");
	//the offset variable represents the center of the kernel
	var offset = Math.floor(kernel.length / 2);
	
	var w = img.width;
    var h = img.height;
    //for each image row
    for (var row = 0; row < h; row++) {
    	//for each pixel
        for (var col = 0; col < w; col++) {
        	//below is the accumulator
            var result = [0, 0, 0, 0];
            //for each kernel row
            for (var kRow = 0; kRow < kernel.length; kRow++) {
            	//for each kernel value
            	for (var kCol = 0; kCol < kernel[kRow].length; kCol++) {
            		var kVal = kernel[kRow][kCol];
            		
            		var pixelRow = row + kRow - offset;
                    var pixelCol = col + kCol - offset;

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
                    	for (var channel = 0; channel < 4; channel++) {
                            if (channel === 3) {
                                continue;
                            }
                            else{
                                var pixel = img.data[srcIndex + channel];
                                result[channel] += pixel * kVal;
                            }
                        }
                    }
            	}
            }
            //now result has the value of that pixel [row,col] in its four channels
            var dstIndex = (row * w + col) * 4;

            for (var channel = 0; channel < 4; channel++) {
                if (channel == 3)
                	continue;
                img.data[dstIndex + channel] = result[channel] / divisor;
            }
        }
    }
    document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
};