var ZGL = function(canvasDomElem){

	console.log(lib);

	canvasDomElem = canvasDomElem || document.createElement('CANVAS');

	var gl = canvasDomElem.getContext('webgl');
	this.gl = gl;


	this.method = function(method){

		
		let zgl = this;
		let gl = this.gl;
		let code = method.toSource();
		return eval(code);
	};

	this.add_method = function(method){
		this[method.name] = this.method(method);
	};

	this.test = this.method( function(){var a=gl;return a;} );

	this.add_method(vbo);
};
ZGL.lib = {testA:'B'};
let zglLib = ZGL.lib;
ZGL = eval('(function(){var lib=ZGL.lib; return '+ZGL.toSource()+'})()');
ZGL.lib = zglLib;

var vbo = function(data){
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};