var showConvolution = function(){
	window.opt = 3;
};

var tableToArray = function () {
	// body...
};

var convolute = function(){
	// var img = ;
	// var k_size = ;
	// var kernel = ;
	var kernelCenter = Math.floor(k_size/2);
	var columns = img.naturalWidth;
	var rows = img.naturalHeight;

	for(i=0; i < rows; ++i){
		// rows of the image
		for(j=0; j < columns; ++j){
			// columns of the image
			for(ki=0; ki < k_size; ++ki){
				// rows of the kernel
				var mm = k_size - 1 - ki; // row index of flipped kernel

				for(kj=0; kj < k_size; ++kj){
					// columns of the kernel
					var nn = k_size - 1 - kj; // column index of flipped kernel

					var ii = i + (ki - k_size);
                	var jj = j + (kj - k_size);

                	if( ii >= 0 && ii < rows && jj >= 0 && jj < columns )
                    	out[i][j] += input[ii][jj] * kernel[mm][nn];
				}
			}
		}
	}

};