window.opt = null

var buffered_img = document.createElement("img");
var blank = document.createElement('canvas');

var readImage = function(event, element) {
	var file = event.target.files[0]
	var reader = new FileReader()

	var imageContainer = document.querySelector('.image-container.hidden')
	imageContainer.classList.remove('hidden')

	var image = document.querySelector('.image-container .img')

	reader.onload = function(event) {
		image.src = event.target.result
	}

	reader.readAsDataURL(file)
	
	if(window.opt == 1)
		document.querySelector('.filter-container').classList.remove('hidden')

};
var genericFilter = function() {
	var canvas = document.querySelector(".canvas")
	canvas.classList.remove('hidden')

	blank.width = canvas.width;
    blank.height = canvas.height;
	
	var ctx = canvas.getContext("2d")

	var img

	if (document.getElementById("original_cb").checked == true){
		img = document.querySelector(".image-container .img")
		document.getElementById('originalh').innerHTML = "Usando imagem original"
	}
	else{
		buffered_img.src = canvas.toDataURL();
      	if (buffered_img.src == blank.toDataURL()){
      		img = document.querySelector(".image-container .img")
      		document.getElementById('originalh').innerHTML = "Usando imagem original"
      	}
      	else{
      		img = buffered_img;
      		document.getElementById('originalh').innerHTML = "Usando última imagem editada"
      	}  	
	}

	ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
	
	return ctx.getImageData(0, 0, canvas.width, canvas.height)
};

var blackAndWhite = function() {
	var imgData = genericFilter()

	for (var i = 0; i < imgData.data.length; i += 4) {
		var mean = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2])/3
		imgData.data[i] = mean
		imgData.data[i+1] = mean
		imgData.data[i+2] = mean
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
};

var negativeBW = function() {
	var imgData = genericFilter()

	for (var i = 0; i < imgData.data.length; i += 4) {
		var mean = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2])/3
		imgData.data[i] = 255 - mean
		imgData.data[i+1] = 255 - mean
		imgData.data[i+2] = 255 - mean
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
};

var negative = function() {
	var imgData = genericFilter()

	for (var i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i] = 255 - imgData.data[i]
		imgData.data[i+1] = 255 - imgData.data[i+1]
		imgData.data[i+2] = 255 - imgData.data[i+2]
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
};

var log = function() {
	var imgData = genericFilter()

	for (var i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i] = Math.log(1 + imgData.data[i])
		imgData.data[i+1] = Math.log(1 + imgData.data[i+1])
		imgData.data[i+2] = Math.log(1 + imgData.data[i+2])
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
};

var exp = function() {
	var imgData = genericFilter()

	for (var i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i] = Math.exp(imgData.data[i])
		imgData.data[i+1] = Math.exp(imgData.data[i+1])
		imgData.data[i+2] = Math.exp(imgData.data[i+2])
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
};

var gamma = function(){
	var imgData = genericFilter()
	var cons = document.getElementById("gammaConst").value;
	var gamma = document.getElementById("gammaRange").value;

	for (var i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i] = cons*Math.pow(imgData.data[i],gamma)
		imgData.data[i+1] = cons*Math.pow(imgData.data[i+1],gamma)
		imgData.data[i+2] = cons*Math.pow(imgData.data[i+2],gamma)
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
};

var gamma_range = function(value){
	var image = document.querySelector('.image-container .img')
	if (image.src || image.src.length || image.src.length != 0) {
		gamma()
	}
	document.getElementById("valuegamma").value = value;

}

var showFilters = function () {
	window.opt = 1;
	var imageContainer = document.querySelector('.filter-container')
	var histogramContainer = document.querySelector('.histogram-container')
	
	if (!histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.add('hidden')
	}

	if (imageContainer.classList.contains('hidden')){
		imageContainer.classList.remove('hidden')
	}
}