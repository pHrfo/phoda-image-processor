var showCompression = function () {
	var compression = document.querySelector('.compression-container')
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
	Object.assign(document.querySelector('.haar-container').style,{display:"none"})
	Object.assign(document.querySelector('.compression-container').style,{display:"block"})
	Object.assign(document.querySelector('.morphological-container').style,{display:"none"})
	
	if (!histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.add('hidden')
		document.querySelector('.chart-div').classList.add('hidden')
	}

	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	}
	
	if(compression.classList.contains('hidden')){
		compression.classList.remove('hidden')
	}


}

var sortHuffmanFrequencies = function(channelsFrequencies){
	let sortedChannel = [];
	for(let i in channelsFrequencies)
		sortedChannel.push([channelsFrequencies[i],i]);

	sortedChannel.sort();
	return sortedChannel;
}

var computeHuffmanFrequencies = function(array){
	let channelsFrequencies = {};
	let sorted;
	for(let i = 0; i < array.length; i += 4){

		if(!(array[i] in channelsFrequencies)){
			channelsFrequencies[array[i]] = 1;
		}

		channelsFrequencies[array[i]]++;
	}

	sorted = sortHuffmanFrequencies(channelsFrequencies);

	return sorted;
}

var buildHuffmanTree = function(tuples){
    var ct = 0;
    console.log(tuples.length)
    while(tuples.length > 1){
        let parent = tuples[0][1] + "_" + tuples[1][1];
        let parentFreq = tuples[0][0] + tuples[1][0];

        tuples = tuples.slice(2,tuples.length);
        ct++;

        end = [parentFreq,parent];
        tuples.push(end);
        tuples.sort();
        if (ct % 100 == 0) {
            console.log(tuples.length)
        }
    }
    console.log("Cabou")
    return tuples[0][1];
}

var assignHuffmanCodes = function(codes, node, pat){
    pat = pat || "";

    if (typeof node == typeof ""){
        codes[node] = pat;
    }
    else{
        assignHuffmanCodes(codes,node[0],pat+"0");
        assignHuffmanCodes(codes,node[1],pat+"1");
    }
    
}

var encodeHuffman = function(codes, array, tree){
	let output="";

    for(let i in array)
        output = output + codes[array[i]];

	return [output, tree];
}

var Huffman = function (data){
	let freqs = computeHuffmanFrequencies(data),
		tree = buildHuffmanTree(freqs)	
		codes = {};

	assignHuffmanCodes(codes,tree);
	encoded = encodeHuffman(codes,data,tree);

	return encoded;
}

var decodeHuffman = function(tree,array){
	let output="",
		p = tree,
		bit;

    for (bit in array){
                
        if (array[bit] == 0){
            p = p[0];
        }
        else{
            p = p[1]
        }
        if (typeof p ==typeof ""){
            output = output + p
            p = tree
        }
    }
    return output
}

var encodeLZW = function(data){
    let out = [],
    currChar,
    phrase = data[0].toString(),
    code = 256,
    i,
    dict = {};
    var j= 0;

    for (i = 1; i < data.length; i++) {
        currChar = data[i].toString();
        if (dict[phrase + "_" + currChar] != null) {
            phrase += "_" + currChar;            
        }
        else {
            out.push(phrase.split("_").length > 1 ? dict[phrase] : phrase);
            dict[phrase + "_" + currChar] = code;
            code++;
            phrase = currChar;
        }
    }
    out.push(phrase.split("_").length > 1 ? dict[phrase] : phrase);
    // console.log(out)
    return out;
}

var decodeLZW = function(data){
	var currChar = data[0].toString(),
        code = 256,
        code_dict = {};
        last = currChar;
        out = [currChar]

    for (let i=0; i<=255; i++) {
        code_dict[i.toString()] = i.toString()
    }

    for (let i = 1; i < data.length; i++) {
        let currChar = data[i].toString();

        var word = ''
        
        if (code_dict[currChar] != undefined) {
            for (var j=0; j<code_dict[currChar].split("_").length; j++)
                out.push(code_dict[currChar].split("_")[j]);
            word = code_dict[last] + "_" + firstChar(code_dict[currChar])
        }

        else {
            word = code_dict[last] + "_" + firstChar(code_dict[last]);
            for (var j=0; j<word.split("_").length; j++)
                out.push(word.split("_")[j]);
            
        }

        code_dict[code] = word;
        code++;
        last = currChar;
    }
    return out;
}

var firstChar = function(str) {
    return str.split("_")[0]
}

var encodeRunLength = function(list_of_chars) {
    var lastChar = list_of_chars[0];
    var counter = 0;
    var encoded = [];
    var currChar;

    for (let el in list_of_chars) {
        currChar = list_of_chars[el];
        
        if (currChar != lastChar) {
            encoded.push([lastChar, counter]);
            counter = 1;
            lastChar = currChar;
        }

        else
            counter++;
    }

    return encoded
}

var decodeRunLength = function(list_of_chars) {
    var decoded = []

    for (let el in list_of_chars){
        var reps = list_of_chars[el][1]
        var ch = list_of_chars[el][0]

        for (var i=0; i<parseInt(reps); i++)
            decoded.push(ch)
        // console.log(decoded)
    }

    return decoded

}

var compress = function() {
	let imgData = genericFilter(),
		encoded = encodeLZW(imgData.data);

    console.log(imgData.data.length)
    console.log(encoded.length)   
    // encoded = encodeRunLength(encoded)
    

    var blob = new Blob([encoded],{type: "application/octet-stream"});
	var fileName = "encoded.phoda";
	saveAs(blob, fileName);

    console.log("To aqui")
    // var decoded = decodeRunLength(encoded)
    var decoded = decodeLZW(encoded)
    console.log(decoded.length)

    for (var i=0; i<imgData.data.length; i++)
        imgData.data[i] = decoded[i]

    document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0);
}

var decompress = function(){
	let files = document.getElementById("compressedImage").files;
    
    var reader = new FileReader();
    
    reader.onloadend = function(e){
        var data = e.target.result.split(",").map(Number);
        var height = data.pop();
        var width = data.pop();
    
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        var imageData = canvas.getContext('2d').createImageData(width, height);

        var decoded = decodeLZW(data);
        imageData.data.set(decoded);

        document.querySelector(".canvas").getContext("2d").putImageData(imageData, 0, 0);

    };
    reader.readAsText(files[0]);
}