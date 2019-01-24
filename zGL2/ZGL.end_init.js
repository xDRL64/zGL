


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
		debugger
	}
}

var ZGL = ZGL_Initializer.ZGL_Class;
delete this.ZGL_Initializer;

this.ZGL.lib = LIBs;