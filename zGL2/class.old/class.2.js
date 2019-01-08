var ZGL = (function(){

	var Lib = [];
	var _lib = [];

	var ZGL = function(canvasDomElem){

		console.log(_lib);
		console.log(Lib);
	
		canvasDomElem = canvasDomElem || document.createElement('CANVAS');
	
		var gl = canvasDomElem.getContext('webgl');
		this.gl = gl;
	
	
		this.link_var = function(method){
			let zgl = this;
			let gl = this.gl;
			let code = method.toSource();
			return eval(code);
		};
	
		this.add_method = function(method){
			this[method.name] = this.link_var(method);
		};
	
		this.set_lib = function(){
			for(method of _lib)
				this.add_method(method);
		};
		this.set_lib();
		
	};

	ZGL.lib = _lib;
	ZGL.Lib = Lib;

	return ZGL;

})();




ZGL.Lib.vbo = function(data){
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};
ZGL.Lib.vbo2 = function(data){
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};

ZGL.lib.push(ZGL.Lib.vbo);
//ZGL.lib.ggg = (function(){});
//ZGL.lib.fff = ZGL.Lib.vbo;