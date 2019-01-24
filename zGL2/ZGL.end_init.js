
// EXTENSION ENABLE :

//ZGL.ext.Math     = ZGL_ext_Math;
//ZGL.ext.Geometry = this.ZGL_ext_Geometry;
//ZGL.ext.Loader   = ZGL_ext_Loader;
//ZGL.ext.FBX      = ZGL_ext_FBX;

//delete this.ZGL_ext_Geometry;

this.ZGL_Initializer.lib.vbo = function(data){
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};





var ZGL = ZGL_Initializer.ZGL_Class;
delete this.ZGL_Initializer;