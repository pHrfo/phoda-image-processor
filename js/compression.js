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
	let channelsFrequencies = {R:{},G:{},B:{}};
	let sortedR, sortedG, sortedB;

	for(let i = 0; i < array.length; i += 4){

		if(!(array[i] in channelsFrequencies.R)){
			channelsFrequencies.R[array[i]] = 1;
		}

		if(!(array[i+1] in channelsFrequencies.R)){
			channelsFrequencies.G[array[i+1]] = 1;
		}

		if(!(array[i+2] in channelsFrequencies.R)){
			channelsFrequencies.B[array[i+2]] = 1;
		}

		channelsFrequencies.R[array[i]]++;
		channelsFrequencies.G[array[i+1]]++;
		channelsFrequencies.B[array[i+2]]++;
	}

	sortedR = sortHuffmanFrequencies(channelsFrequencies.R);
	sortedG = sortHuffmanFrequencies(channelsFrequencies.G);
	sortedB = sortHuffmanFrequencies(channelsFrequencies.B);

	return [sortedR, sortedG, sortedB];
}

var buildHuffmanTree = function(tuples){
    while(tuples.length > 1){
        let parent = [tuples[0][1],tuples[1][1]];
        let parentFreq = tuples[0][0] + tuples[1][0];

        let rest = tuples.slice(2,tuples.length);

        tuples = rest;
        end = [parentFreq,parent];
        tuples.push(end);
        tuples.sort();
    }
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

var Huffman = function (img){
	let freqs = computeHuffmanFrequencies(img.data),
		treeR = buildHuffmanTree(freqs[0]),
		treeG = buildHuffmanTree(freqs[1]),
		treeB = buildHuffmanTree(freqs[2]),	
		codes = {R:{},G:{},B:{}},
		encodedR, encodedG, encodedB;

	assignHuffmanCodes(codes.R,treeR);
	assignHuffmanCodes(codes.G,treeG);
	assignHuffmanCodes(codes.B,treeB);

	encodedR = encodeHuffman(codes.R,img.data,treeR);
	encodedG = encodeHuffman(codes.G,img.data,treeG);
	encodedB = encodeHuffman(codes.B,img.data,treeB);

	return [encodedR,encodedG,encodedB];
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


var saveBinary = function(rgb){

}

var readBinary = function(file){

}

var encodeRunlength = function(array){
    let result = '',
        zeros = 0,
        zerosTemp = '',
        wordLength = 0;

    for (i = 0; i < array.length; i ++) {
        if (array[i] === '0') 
            zeros += 1;
        
        else{
            zerosTemp = zeros.toString(2);
            wordLength = zerosTemp.length - 1;

            while (wordLength) {
                result = result + '1';
                wordLength -= 1;
            }
            
            result += '0' + zerosTemp;
            zeros = 0;
        }
    }
    return result;
}

var decodeRunLength = function(array){

}

var encodeLZW = function(array, dict){
	    let data = array.split(""),
	    out = [],
	    currChar,
	    phrase = data[0],
	    code = 256,
	    i;

    for (i = 1; i < data.length; i++) {
        currChar = data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase = currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (i = 0; i < out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

var decodeLZW = function(array, dict){
	let data = array.split(""),
        currChar = data[0],
        oldPhrase = currChar,
        out = [currChar],
        code = 256,
        phrase;
	    

    for (let i = 1; i < data.length; i++) {
        let currCode = data[i].charCodeAt(0);
        
        if (currCode < 256) {
            phrase = data[i];
        }
        
        else{
            phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }

        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}

var compress = function(){
	let img = genericFilter(),
		dict = {},
		encoded = Huffman(img);
	
	let huffman_length = encoded[0][0].length + encoded[1][0].length + encoded[2][0].length;
	
	console.log("Total Huffman length:",huffman_length);
	let oR = encodeLZW(encoded[0][0],dict);
	let oG = encodeLZW(encoded[1][0],dict);
	let oB = encodeLZW(encoded[2][0],dict);
	console.log("Total LZW length:", oR.length + oG.length + oB.length);
	// let rlR = encodeRunlength(encoded[0][0]);
	// console.log(rlR.length)

	var blob = new Blob([oR,
						oG,
						oB,
						encoded[0][1],
						encoded[1][1],
						encoded[2][1]], {type: "application/octet-stream"});
	var fileName = "encoded.phoda";
	saveAs(blob, fileName);
	// let rlG = encodeRunlength(encoded[1][0]);
	// let rlB = encodeRunlength(encoded[2][0]);
	// saveBinary({R:[rlR,encoded[0][1]], G: [rlG,encoded[1][1]], B: [rlB,encoded[2][1]]})
}

var decompress = function(){
	let files = document.getElementById("compressedImage").files;
	// tree,array = readBinary(file);
	// array = decodeRunLength(array);
	// let dataR = decodeHuffman(tree,array);
}