"use strict";


var zGL_shader_lib = (function(gl){

	// for : internal zGL
	function _build(code,type){
		var shader = gl.createShader(type);
		gl.shaderSource(shader, code);
		gl.compileShader(shader);
		console.log(gl.getShaderInfoLog(shader));
		return shader;
	};

	// for : vertex shader code
	// get : GPU vertex bin reference
	function vBuild(code){
		return _build(code, gl.VERTEX_SHADER);
	};
	
	// for : fragment shader code
	// get : GPU fragment bin reference
	function fBuild(code){
		return _build(code, gl.FRAGMENT_SHADER);
	};
	
	// for : bin shader
	// get : GPU program reference
	function shader(vBin,fBin){
		var prog = gl.createProgram();
		gl.attachShader(prog, vBin);
		gl.attachShader(prog, fBin);
		gl.linkProgram(prog);
		return prog;
	};
	
	// for : shader attribute names
	// get : shader attribute index
	function get_attributes(prog, names){
		var refs = {};
		for(var i=0; i<names.length; i++)
			refs[names[i]] = gl.getAttribLocation(prog, names[i]);
		return refs;
	};
	
	// for : shader uniform names
	// get : shader uniform index
	function get_uniforms(prog, names){
		var refs = {};
		for(var i=0; i<names.length; i++)
			refs[names[i]] = gl.getUniformLocation(prog, names[i]);
		return refs;
	};


	return {
		_build         : _build,
		vBuild         : vBuild,
		fBuild         : fBuild,
		shader         : shader,
		get_attributes : get_attributes,
		get_uniforms   : get_uniforms
	};

});


export { zGL_shader_lib };