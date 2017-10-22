window.backimg = undefined

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
	var file = event.target.files[0];
	var reader = new FileReader();

	var image = document.createElement('img');
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	
	reader.onload = function(event) {
		image.src = event.target.result;
		
		ctx.drawImage(image, 0, 0, image.width, image.height);
	}
	canvas.width = image.width;
	canvas.height = image.height;
	
	reader.readAsDataURL(file);
	

	window.backimg = ctx.getImageData(0, 0, image.width, image.height);
}

var applyChroma = function(){
	var img = genericFilter();
	
	var rc = parseInt(document.querySelector('.rc').value);
	var gc = parseInt(document.querySelector('.gc').value);
	var bc = parseInt(document.querySelector('.bc').value);
	
	var radius = parseInt(document.querySelector('.radius').value);
	var transparency = parseInt(document.querySelector('.trans').value);

	if(window.backimg)

		for (var i = 0; i < img.data.length; i += 4) {
			var si = Math.pow(rc - img.data[i],2) + 
					Math.pow(gc - img.data[i+1],2) + 
					Math.pow(bc - img.data[i+2],2)

			if (si <= Math.pow(radius,2)){
				// console.log(img.data[i],window.backimg[i])
				img.data[i] = window.backimg[i];
				img.data[i+1] = window.backimg[i+1];
				img.data[i+2] = window.backimg[i+2];

			}
			
		}
	document.querySelector(".canvas").getContext("2d").putImageData(img, 0, 0)
}