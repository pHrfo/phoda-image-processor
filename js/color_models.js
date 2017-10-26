window.satu = 100;
window.inten = 50;
window.hue = 0;


var showColorModels = function() {
	var cmodels = document.querySelector('.color-model-container')
	var imageContainer = document.querySelector('.filter-container')
	var histogramContainer = document.querySelector('.histogram-container')

	Object.assign(document.querySelector('.histogram-container').style,{display:"none"});
	Object.assign(document.querySelector('.enhancing-container').style,{display: "none"})
	Object.assign(document.querySelector('.convolution-container').style,{display:"none"});
	Object.assign(document.querySelector(".resize-container").style,{display:"none"});
	Object.assign(document.querySelector(".frequency-container").style,{display:"none"})
	Object.assign(document.querySelector(".adaptative-container").style,{display:"none"})
	Object.assign(document.querySelector('.color-model-container').style,{display:"block"})
	Object.assign(document.querySelector('.chroma-key-container').style,{display:"none"})
	Object.assign(document.querySelector('.shine-container').style,{display:"none"})

	if (!histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.add('hidden')
		document.querySelector('.chart-div').classList.add('hidden')
	}

	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	}
	
	if(cmodels.classList.contains('hidden')){
		cmodels.classList.remove('hidden')
	}
	
	initialize();

}


var fromRGB = function(input) {
	var r = (input ? input[0] : document.querySelector('.models-input.r').value)
	var g = (input ? input[1] : document.querySelector('.models-input.g').value)
	var b = (input ? input[2] : document.querySelector('.models-input.b').value)

	document.querySelector('.models-input.c').value = 255 - r
	document.querySelector('.models-input.m').value = 255 - g
	document.querySelector('.models-input.y').value = 255 - b

	var numerator = ((r-g) + (r-b))/2
	var denominator = Math.sqrt((Math.pow(r-g,2) + (r-b)*(g-b)))
	var theta = Math.acos(numerator/denominator)

	document.querySelector('.models-input.h').value = (b <= g ? theta : 360 - theta)
	document.querySelector('.models-input.s').value = 1 - 3*Math.min(r,g,b)/(r+g+b)
	document.querySelector('.models-input.i').value = r/3 + g/3 + b/3

	var canv = document.querySelector(".canvas")
	if (input == undefined) {
		if (canv.classList.contains("hidden")) {
			canv.classList.remove('hidden')
		}
		var ctx = canv.getContext("2d")
		ctx.fillRect(20,20,400,400)
	
		ctx = ctx.getImageData(0, 0, canv.width, canv.height)
	
		for (var i = 0; i < ctx.data.length; i += 4) {
			ctx.data[i] = r
			ctx.data[i+1] = g
			ctx.data[i+2] = b
		}
		document.querySelector(".canvas").getContext("2d").putImageData(ctx, 0, 0)
	}

	if (input != undefined) {
		return {
			'cmy': [255-r, 255-g, 255-b],
			'hsi': [(b <= g ? theta : 360 - theta), 1 - 3*Math.min(r,g,b)/(r+g+b), r/3 + g/3 + b/3]
		}
	}
}

var fromCMY = function(input) {
	var r = (input ? input[0] : 255 - document.querySelector('.models-input.c').value)
	var g = (input ? input[1] : 255 - document.querySelector('.models-input.m').value)
	var b = (input ? input[2] : 255 - document.querySelector('.models-input.y').value)

	document.querySelector('.models-input.r').value = r
	document.querySelector('.models-input.g').value = g
	document.querySelector('.models-input.b').value = b

	var numerator = ((r-g) + (r-b))/2
	var denominator = Math.sqrt((Math.pow(r-g,2) + (r-b)*(g-b)))
	var theta = Math.acos(numerator/denominator)

	document.querySelector('.models-input.h').value = (b <= g ? theta : 360 - theta)
	document.querySelector('.models-input.s').value = 1 - 3*Math.min(r,g,b)/(r+g+b)
	document.querySelector('.models-input.i').value = r/3 + g/3 + b/3

	var canv = document.querySelector(".canvas")
	if (canv.classList.contains("hidden")) {
		canv.classList.remove('hidden')
	}
	var ctx = canv.getContext("2d")
	ctx.fillRect(20,20,400,400)

	ctx = ctx.getImageData(0, 0, canv.width, canv.height)

	for (var i = 0; i < ctx.data.length; i += 4) {
		ctx.data[i] = r
		ctx.data[i+1] = g
		ctx.data[i+2] = b
	}
	document.querySelector(".canvas").getContext("2d").putImageData(ctx, 0, 0)
}

var fromHSI = function(input) {
	var h = (input ? input[0] : document.querySelector('.models-input.h').value)
	var s = (input ? input[1] : document.querySelector('.models-input.s').value)
	var i = (input ? input[2] : document.querySelector('.models-input.i').value)

	var r,g,b
	if (h < 120) {
		r = i*(1 + (s*Math.cos(h))/(Math.cos(60-h)))
		b = (1-s) < 0.001 ? 0 : i*(1-s)
		g = 3*i - (r+b)
	}

	else if (h < 240) {
		r = (1-s) < 0.001 ? 0 : i*(1-s)
		g = i*(1 + (s*Math.cos(h))/(Math.cos(60-h)))
		b = 3*i - (r+g)
	}

	else {
		g = (1-s) < 0.001 ? 0 : i*(1 - s)
		b = i*(1 + (s*Math.cos(h))/(Math.cos(60-h)))
		r = 3*i - (g+b)
	}

	// console.log(r,g,b)

	var canv = document.querySelector(".canvas")

	if (input == undefined) {
		document.querySelector('.models-input.r').value = parseInt(r)
		document.querySelector('.models-input.g').value = parseInt(g)
		document.querySelector('.models-input.b').value = parseInt(b)
	
		document.querySelector('.models-input.c').value = 255 - parseInt(r)
		document.querySelector('.models-input.m').value = 255 - parseInt(g)
		document.querySelector('.models-input.y').value = 255 - parseInt(b)

		if (canv.classList.contains("hidden")) {
			canv.classList.remove('hidden')
		}

		var ctx = canv.getContext("2d")
		ctx.fillRect(20,20,400,400)

		ctx = ctx.getImageData(0, 0, canv.width, canv.height)

		for (var i = 0; i < ctx.data.length; i += 4) {
			ctx.data[i] = r
			ctx.data[i+1] = g
			ctx.data[i+2] = b
		}
		document.querySelector(".canvas").getContext("2d").putImageData(ctx, 0, 0)

	}

	if (input != undefined) {
		return {'rgb': [parseInt(r), parseInt(g), parseInt(b)],
				'cmy': [255-parseInt(r), 255-parseInt(g), 255-parseInt(b)]}
	}
}


var changeSaturation = function(sat){
	//change value in input box
	let saturation = document.querySelector('.saturation').children;
	for(let i = 0; i < 100; i++){
		saturation[i].style.background = "hsl("+window.hue+","+i+"%,50%)";
	}
}

var changeIntensity = function(inte){
	//change value in input box
	let inten = document.querySelector('.intensity').children;
	for(let i = 0; i < 100; i++){
		inten[i].style.background = "hsl("+window.hue+",100%,"+i+"%)";
	}
}

var clickHue = function(value){
	//change value in input box
	window.hue = value;
	document.querySelector(".h").value=value
	changeSaturation(window.satu);
	changeIntensity(window.inten);
	
}

var clickSaturation = function(value) {
	document.querySelector(".s").value=value/100
	window.satu = value;
}

var clickIntensity = function(value) {
	document.querySelector(".i").value=value*255/100
	window.inten = value;

}

var makehue = function(){
	let hue = document.querySelector('.hue');
	//let row = hue.insertRow(0);
	for(let i = 0; i < 360; i++){
		//let cell = row.insertCell(i);
		let cell = document.createElement("div")
		cell.style.background = "hsl("+i+",100%,50%)";
		// let w = document.querySelector(".tableslider").style.width/360
		// console.log(w)
		// cell.style.width = w+"px"
		cell.setAttribute('onmousemove','clickHue('+i+')');
		cell.setAttribute("onmouseout",'clickHue('+i+')');
		cell.setAttribute('onmouseover','attBallon(event)');

		hue.append(cell)
	}
}

var makeSaturarion = function(){
	let saturation = document.querySelector('.saturation');
	//let row = saturation.insertRow(0);

	for(let i = 0; i < 100; i++){
		let cell = document.createElement("div")
		//let cell = row.insertCell(i);
		cell.style.background = "hsl(0,"+i+"%,50%)";

		cell.setAttribute('onmousemove','clickSaturation('+i+')');
		cell.setAttribute("onmouseout",'clickSaturation('+i+')');

		saturation.append(cell)
	}
}

var attBallon = function(event){				
	event.target.classList.add('target')
}

var makeIntentisy = function(){
	let intensity = document.querySelector('.intensity');
	// let row = intensity.insertRow(0);

	for(let i = 0; i < 100; i++){
		let cell = document.createElement("div")
		//let cell = row.insertCell(i);
		cell.style.background = "hsl(0,100%,"+i+"%)";

		cell.setAttribute('onmousemove','clickIntensity('+i+')');
		cell.setAttribute("onmouseout",'clickIntensity('+i+')');

		intensity.append(cell)
	}
}


var initialize = function(){
	makehue();
	makeSaturarion();
	makeIntentisy();

	clickHue(0);
}
