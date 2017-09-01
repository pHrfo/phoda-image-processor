
var showHistogram = function () {
	window.opt= 2;
	var histogramContainer = document.querySelector('.histogram-container')
	var imageContainer = document.querySelector('.filter-container')

	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	} 
	if (histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.remove('hidden')
	}
}

var completeHistogram = function() {
	
}