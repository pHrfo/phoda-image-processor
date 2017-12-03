var showShine = function(){
	var shine = document.querySelector('.shine-container')
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
	Object.assign(document.querySelector('.shine-container').style,{display:"block"})
	Object.assign(document.querySelector('.haar-container').style,{display:"none"})
	Object.assign(document.querySelector('.compression-container').style,{display:"none"})
	Object.assign(document.querySelector('.morphological-container').style,{display:"none"})
	
	if (!histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.add('hidden')
		document.querySelector('.chart-div').classList.add('hidden')
	}

	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	}
	
	if(shine.classList.contains('hidden')){
		shine.classList.remove('hidden')
	}
}

var shineRGB = function() {
	var img = genericFilter();
	
	var kr = parseFloat(document.querySelector('.kr').value);
	var kg = parseFloat(document.querySelector('.kg').value);
	var kb = parseFloat(document.querySelector('.kb').value);

	for (var i = 0; i < img.data.length; i += 4) {
		img.data[i] = kr*img.data[i];
		img.data[i+1] = kg*img.data[i+1];
		img.data[i+2] = kb*img.data[i+2];
	}
	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
}

var shineHSI = function() {
	var img = genericFilter();
	
	var ki = parseFloat(document.querySelector('.ki').value);

	for (var i = 0; i < img.data.length; i += 4) {
		var hsi = fromRGB([img.data[i],img.data[i+1],img.data[i+2]])['hsi']

		var newi = ki*hsi[2]

		// console.log([hsi[0],hsi[1],newi])

		var rgb = fromHSI([hsi[0], hsi[1], newi])['rgb']

		img.data[i] = rgb[0]
		img.data[i+1] = rgb[1]
		img.data[i+2] = rgb[2]
	}
	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
}