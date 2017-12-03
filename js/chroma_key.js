window.backimg = document.createElement('img')

var showChromaKey = function(){
	var ckey = document.querySelector('.chroma-key-container')
	var imageContainer = document.querySelector('.filter-container')
	var histogramContainer = document.querySelector('.histogram-container')

	Object.assign(document.querySelector('.histogram-container').style,{display:"none"});
	Object.assign(document.querySelector('.enhancing-container').style,{display: "none"})
	Object.assign(document.querySelector('.convolution-container').style,{display:"none"});
	Object.assign(document.querySelector(".resize-container").style,{display:"none"});
	Object.assign(document.querySelector(".frequency-container").style,{display:"none"})
	Object.assign(document.querySelector(".adaptative-container").style,{display:"none"})
	Object.assign(document.querySelector('.color-model-container').style,{display:"none"})
	Object.assign(document.querySelector('.chroma-key-container').style,{display:"block"})
	Object.assign(document.querySelector('.shine-container').style,{display:"none"})
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
	
	if(ckey.classList.contains('hidden')){
		ckey.classList.remove('hidden')
	}
}

var readBackImage = function(event, element){
	var file = event.target.files[0]
	var reader = new FileReader()

	reader.onload = function(event) {
		window.backimg.src = event.target.result
	}

	reader.readAsDataURL(file)
}

var getSumFactor = function(ri, ai) {
	return Math.pow(ri - ai,2) >= 0 ? Math.pow(ri - ai,2) : 0
}

var applyChroma = function(){
	var img = genericFilter();

	var canvas = document.createElement('canvas');
	canvas.width = img.width
	canvas.height = img.height
	canvas.getContext('2d').drawImage(window.backimg, 0, 0, canvas.width, canvas.height)
	var backimg = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
	
	var rc = parseInt(document.querySelector('.rc').value);
	var gc = parseInt(document.querySelector('.gc').value);
	var bc = parseInt(document.querySelector('.bc').value);
	
	var radius = parseInt(document.querySelector('.radius').value);
	var transparency = +document.querySelector('.trans').value;

	if(window.backimg)

		for (var i = 0; i < img.data.length; i += 4) {
			var si = getSumFactor(img.data[i], rc)/3 + 
				   getSumFactor(img.data[i+1], gc)/3 + 
				   getSumFactor(img.data[i+2], bc)/3

			//console.log(si, radius, img.data[i], backimg.data[i])

			if (si <= Math.pow(radius,2)){
				
				// console.log(img.data[i],window.backimg[i])
				img.data[i] = backimg.data[i];
				img.data[i+1] = backimg.data[i+1];
				img.data[i+2] = backimg.data[i+2];

			}

			else {
				img.data[i] = transparency*img.data[i] + (1-transparency)*backimg.data[i];
				img.data[i+1] = transparency*img.data[i+1] + (1-transparency)*backimg.data[i+1];
				img.data[i+2] = transparency*img.data[i+2] + (1-transparency)*backimg.data[i+2];
			}
			
		}
	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
}