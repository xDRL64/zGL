
// EXTENSION ENABLE :

ZGL.ext.Geometry = ZGL_ext_Geometry;
ZGL.ext.Math     = ZGL_ext_Math;
ZGL.ext.Loader   = ZGL_ext_Loader;
ZGL.ext.FBX      = ZGL_ext_FBX;



ZGL.lib.vbo = function(data){
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};