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
}

var haar_1d = function() {

}

var haar = function() {
	var img = genericFilter()
	var line = getLine(img.width, img.height, 3, 'l')
	console.log(line)
}

var getLine = function(width, height, index, type) {
	var l = []
	if (type == 'l') {
		for (var i=0; i<width; i++) {
			l.push(4*(height*index + i))
		}
	}

	else {
		for (var i=0; i<height; i++) {
			l.push(4*(i*width + index))
		}
	}

	return l

}