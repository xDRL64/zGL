var ZGL = (function(){

	var _lib = {};

	var ZGL = function(canvasDomElem){

		canvasDomElem = canvasDomElem || document.createElement('CANVAS');
		this.domElem = canvasDomElem;
	
		var gl = canvasDomElem.getContext('webgl');
		this.gl = gl;
	
		this.connect_scope = function(method){
			let zgl = this;
			let gl = this.gl;
			let code = method.toSource();
			return eval(code);
		};
	
		this.add_method = function(name, method){
			this[name] = this.connect_scope(method);
		};

		this.set_lib = function(){
			let names = Object.keys(_lib);
			for(name of names)
				this.add_method(name, _lib[name]);
		};
		this.set_lib();
		
	};

	ZGL.lib = _lib;

	return ZGL;

})();


var vbo = function(data){
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};

ZGL.lib.vbo = function(data){
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};

ZGL.lib.vbo2 = function(data){
    console.log(zgl === this);
};


ZGL.lib.ggg = (function(){});
ZGL.lib.fff = ZGL.lib.vbo;
ZGL.lib.ffsf = vbo;