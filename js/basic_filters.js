window.opt = null

var buffered_img = document.createElement("img");
window.blank = document.createElement('canvas');

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
var genericFilter = function(useOriginal) {
	useOriginal = typeof useOriginal !== 'undefined' ? useOriginal : true
	var canvas = document.querySelector(".canvas")

	if (canvas.classList.contains('hidden'))
		canvas.classList.remove('hidden')

	window.blank.width = canvas.width;
    window.blank.height = canvas.height;

    window.emptyCanvas = false

	var img = {}

	if ((document.getElementById("original_cb").checked == true)||(useOriginal)){
		img = document.querySelector(".image-container .img")
		if (img.src)
			document.getElementById('originalh').innerHTML = "Using original image"

		window.emptyCanvas = true
	}
	else{
      	if (canvas.toDataURL() == window.blank.toDataURL()){
      		img = document.querySelector(".image-container .img")
      		if (img.src)
      			document.getElementById('originalh').innerHTML = "Using original image"

      		window.emptyCanvas = true
      	}
      	else{
      		document.getElementById('originalh').innerHTML = "Using last edited image"
      	}  
	}

	var ctx = canvas.getContext("2d")
	if ((window.emptyCanvas)||(useOriginal)) {
		canvas.width  = img.width
		canvas.height = img.height
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
	}
	
	return ctx.getImageData(0, 0, canvas.width, canvas.height)
};

var blackAndWhite = function() {
	var imgData = genericFilter()
	if(imgData){

		for (var i = 0; i < imgData.data.length; i += 4) {
			var mean = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2])/3
			imgData.data[i] = mean
			imgData.data[i+1] = mean
			imgData.data[i+2] = mean
		}
		document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
	}
};

var negativeBW = function() {
	var imgData = genericFilter()
	if(imgData){
		for (var i = 0; i < imgData.data.length; i += 4) {
			var mean = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2])/3
			imgData.data[i] = 255 - mean
			imgData.data[i+1] = 255 - mean
			imgData.data[i+2] = 255 - mean
		}
		document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
	}
};

var negative = function() {
	var imgData = genericFilter()
	if(imgData){

		for (var i = 0; i < imgData.data.length; i += 4) {
			imgData.data[i] = 255 - imgData.data[i]
			imgData.data[i+1] = 255 - imgData.data[i+1]
			imgData.data[i+2] = 255 - imgData.data[i+2]
		}
		document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
	}
};

var log = function() {
	var imgData = genericFilter()
	if(imgData){
		for (var i = 0; i < imgData.data.length; i += 4) {
			imgData.data[i] = 46*Math.log(1 + imgData.data[i])
			imgData.data[i+1] = 46*Math.log(1 + imgData.data[i+1])
			imgData.data[i+2] = 46*Math.log(1 + imgData.data[i+2])
		}
		document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
	}
};

var exp = function() {
	var imgData = genericFilter()
	if(imgData){
		for (var i = 0; i < imgData.data.length; i += 4) {
			imgData.data[i] = Math.exp(imgData.data[i])
			imgData.data[i+1] = Math.exp(imgData.data[i+1])
			imgData.data[i+2] = Math.exp(imgData.data[i+2])
		}
		document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
	}
};

var threshold = function() {
	var imgData = genericFilter()

	if(imgData){
		var thresh = document.getElementById("thresholdValue").value

		for (var i = 0; i < imgData.data.length; i += 4) {
			var mean = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2])/3
			imgData.data[i] = (mean > thresh ? 0 : 255)
			imgData.data[i+1] = (mean > thresh ? 0 : 255)
			imgData.data[i+2] = (mean > thresh ? 0 : 255)
		}
		document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
	}
};

var gamma = function(){
	var imgData = genericFilter()

	if(imgData){
		var cons = document.getElementById("gammaConst").value
		var gamma = document.getElementById("gammaRange").value
		
		for (var i = 0; i < imgData.data.length; i += 4) {
			imgData.data[i] = cons*Math.pow(imgData.data[i],gamma)
			imgData.data[i+1] = cons*Math.pow(imgData.data[i+1],gamma)
			imgData.data[i+2] = cons*Math.pow(imgData.data[i+2],gamma)
		}
		document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
	}
};

var gamma_range = function(value){
	var image = document.querySelector('.image-container .img')
	if (image.src || image.src.length || image.src.length != 0) {
		gamma()
	}
	document.getElementById("valuegamma").value = value;

};

var bitPlaneSlicing = function () {
	var value = document.querySelector(".bit-plane-input").value
	var imgData = genericFilter()
	if(imgData){
		for (var i = 0; i < imgData.data.length; i += 4) {
			var mean = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2])/3
			imgData.data[i] = (mean&Math.pow(2,value-1) ? 255 : 0)
			imgData.data[i+1] = (mean&Math.pow(2,value-1) ? 255 : 0)
			imgData.data[i+2] = (mean&Math.pow(2,value-1) ? 255 : 0)
		}
		document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
	}
};

var findPoints = function(x1, y1, x2, y2) {
	var dist1 = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2))
	var dist2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2))

	return (dist1 < dist2 ? [[x1, y1], [x2, y2]] : [[x2, y2], [x1, y1]])
}

var contrastStretching = function() {
	var imgData = genericFilter()

	if (imgData) {
		var x1 = document.querySelector('.point-input.x1').value
		var y1 = document.querySelector('.point-input.y1').value
		var x2 = document.querySelector('.point-input.x2').value
		var y2 = document.querySelector('.point-input.y2').value

		var points = findPoints(x1, y1, x2, y2)

		var p1 = points[0]
		var p2 = points[1]
		var o  = [0, 0]
		var mx = [255, 255]

		var line = function(x, p1, p2) {
			var m = (p2[1] - p1[1])/(p2[0] - p1[0])
			var c = p1[1] - m*p1[0]
			var output = m*x + c
			return (output > 255 ? 255 : output)
		}

		var decision = function(x) {
			return (x < p1[0] ? line(x, o, p1) : (x < p2[0] ? line(x, p1, p2) : line(x, p2, mx)))
		}

		for (var i = 0; i < imgData.data.length; i += 4) {
			imgData.data[i] = decision(imgData.data[i])
			imgData.data[i+1] = decision(imgData.data[i+1])
			imgData.data[i+2] = decision(imgData.data[i+2])
		}
		
		document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)


	}
}

var showFilters = function () {
	window.opt = 1;
	var imageContainer = document.querySelector('.filter-container')
	var histogramContainer = document.querySelector('.histogram-container')
	
	Object.assign(document.querySelector('.histogram-container').style,{display:"none"});
	Object.assign(document.querySelector('.convolution-container').style,{display:"none"});


	if (!histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.add('hidden')
		document.querySelector('.chart-div').classList.add('hidden')
	}


	if (imageContainer.classList.contains('hidden')){
		imageContainer.classList.remove('hidden')
	}

}