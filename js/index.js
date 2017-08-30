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
	
	document.querySelector('.filter-container').classList.remove('hidden')

}
var genericFilter = function() {
	var canvas = document.querySelector(".canvas")
	canvas.classList.remove('hidden')
	
	var ctx = canvas.getContext("2d")

	var img = document.querySelector(".image-container .img")

	ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
	
	return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

var blackAndWhite = function() {
	var imgData = genericFilter()

	for (var i = 0; i < imgData.data.length; i += 4) {
		var mean = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2])/3
		imgData.data[i] = mean
		imgData.data[i+1] = mean
		imgData.data[i+2] = mean
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
}

var negativeBW = function() {
	var imgData = genericFilter()

	for (var i = 0; i < imgData.data.length; i += 4) {
		var mean = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2])/3
		imgData.data[i] = 255 - mean
		imgData.data[i+1] = 255 - mean
		imgData.data[i+2] = 255 - mean
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
}

var negative = function() {
	var imgData = genericFilter()

	for (var i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i] = 255 - imgData.data[i]
		imgData.data[i+1] = 255 - imgData.data[i+1]
		imgData.data[i+2] = 255 - imgData.data[i+2]
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
}

var log = function() {
	var imgData = genericFilter()

	for (var i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i] = Math.log(imgData.data[i])
		imgData.data[i+1] = Math.log(imgData.data[i+1])
		imgData.data[i+2] = Math.log(imgData.data[i+2])
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
}

var exp = function() {
	var imgData = genericFilter()

	for (var i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i] = Math.exp(imgData.data[i])
		imgData.data[i+1] = Math.exp(imgData.data[i+1])
		imgData.data[i+2] = Math.exp(imgData.data[i+2])
	}
	document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
}