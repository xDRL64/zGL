


this.ZGL_Initializer.lib.vbo = function(data){
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};


var LIBs = {
	vbo99 : function(data){
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		return vBuffer;
	},
	vbo8 : function(data){
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		return vBuffer;
	},
	vbo7 : function(data){
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		return vBuffer;
	}
};

// dependences exemple
var EXTs = {
	shader45:function(zgl){
		this.a = 5;
		this.DEPS = [{name:'s46', src:'B'}];
		this.testDeps = function(){
			console.log('s46 : ',s46);
		};
		this.__LINK__ = eval(ZGL.EXTENSION_CORE_LIB.__LINK__code);
	},
	shader46:function(){
		this.NAME = 'B';
		this.b = 6;
	},
	shader47:function(){
		this.c = 7;
	},
};

var ZGL = ZGL_Initializer.ZGL_Class;
delete this.ZGL_Initializer;

this.ZGL.lib = LIBs;
this.ZGL.ext = EXTs;