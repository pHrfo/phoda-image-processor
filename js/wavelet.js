window.level = 0

var showHaar = function(){
	var haar = document.querySelector('.haar-container')
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
	Object.assign(document.querySelector('.haar-container').style,{display:"block"})


	if (!histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.add('hidden')
		document.querySelector('.chart-div').classList.add('hidden')
	}

	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	}
	
	if(haar.classList.contains('hidden')){
		haar.classList.remove('hidden')
	}

	var obj = haar_1d([6,12,15,15,14,12,120,116])
	var iobj = ihaar_1d([9, 15, 13, 118, 3, 0, -1, -2])
}

var haar_1d = function(line) {
	var c = []
	var d = []
	for (var i=1; i < line.length; i += 2) {
		if (window.show)
			console.log((line[i] - line[i-1])/2)
		c.push((line[i] + line[i-1])/2)
		d.push((line[i] - line[i-1])/2)
	}
	return c.concat(d)
}

var ihaar_1d = function(line) {
	var c = line.slice(0, line.length/2)
	var d = line.slice(line.length/2, line.length)
	var n_line = []
	for (var i = 0; i < c.length; i++) {
		if (window.show) {
			console.log(d[i])
		}
		n_line.push(c[i] - d[i])
		n_line.push(c[i] + d[i])
	}

	return n_line
}

var wavelet = function(transform, opt) {
	var img = genericFilter()
	var w = img.width/Math.pow(2,window.level)
	var h = img.height/Math.pow(2,window.level)


	for (var i = 0; i < w; i++) {
		var col_idxs = getLine(w, h, i, 'c')
		var col = []
		for (var j = 0; j<col_idxs.length; j++) {
			col.push(window.data[col_idxs[j]])
			col.push(window.data[col_idxs[j] + 1])
			col.push(window.data[col_idxs[j] + 2])
		}

		var transformed = transform(col)

		for (var j = 0; j<col_idxs.length; j++) {
			img.data[col_idxs[j]] = transformed[3*j]
			img.data[col_idxs[j] + 1] = transformed[3*j + 1]
			img.data[col_idxs[j] + 2] = transformed[3*j + 2]

			window.data[col_idxs[j]] = transformed[3*j]
			window.data[col_idxs[j] + 1] = transformed[3*j + 1]
			window.data[col_idxs[j] + 2] = transformed[3*j + 2]
		}
	}

	for (var i = 0; i < h; i++) {
		var line_idxs = getLine(w, h, i, 'l')
		var line = []
		for (var j = 0; j<line_idxs.length; j++) {
			line.push(window.data[line_idxs[j]])
			line.push(window.data[line_idxs[j] + 1])
			line.push(window.data[line_idxs[j] + 2])
		}

		var transformed = transform(line)

		for (var j = 0; j<line_idxs.length; j++) {
			img.data[line_idxs[j]] = transformed[3*j]
			img.data[line_idxs[j] + 1] = transformed[3*j + 1]
			img.data[line_idxs[j] + 2] = transformed[3*j + 2]

			window.data[line_idxs[j]] = transformed[3*j]
			window.data[line_idxs[j] + 1] = transformed[3*j + 1]
			window.data[line_idxs[j] + 2] = transformed[3*j + 2]
		}
	}
	window.img = img
	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
}

var haar = function() {
	if (!window.data) {
		var img = genericFilter()
		window.data = []	
		for (var i=0; i<img.data.length; i+=4){
			window.data.push(img.data[i])
			window.data.push(img.data[i+1])
			window.data.push(img.data[i+2])
			window.data.push(1)
		}
		console.log(window.data)
	}
	wavelet(haar_1d)
	window.level += 1
}

var inverseHaar = function() {
	console.log(window.data)
	window.level -= 1
	wavelet(ihaar_1d)
}

var getLine = function(width, height, index, type) {
	var l = []
	if (type == 'l') {
		for (var i=0; i<width; i++) {
			l.push(4*(width*index + i))
		}
	}

	else {
		for (var i=0; i<height; i++) {
			l.push(4*(i*width + index))
		}
	}

	return l
}

