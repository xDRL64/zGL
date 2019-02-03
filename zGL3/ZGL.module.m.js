"use strict";

// CLASS
import {ZGL_Class as get_ZGL_class} from './core/ZGL.class.m.js';

// SYS LIB
import {FuncScopeRedefiner}  from './dependences/TinyTools/FuncScopeRedefiner.m.js';
window.FuncScopeRedefiner = FuncScopeRedefiner;
import {ObjectPropertiesLib} from './dependences/TinyTools/ObjectPropertiesLib.m.js';

// EXTENSIONS
import {Math}     from './extensions/ZGL.ext.Math.m.js';
import {Geometry} from './extensions/ZGL.ext.Geometry.m.js';
import {FBX}      from './extensions/ZGL.ext.FBX.m.js';
import {Loader}   from './extensions/ZGL.ext.Loader.m.js';
import {Shader}   from './extensions/ZGL.ext.Shader.m.js';

// DEFAULT WEBGL LIB
import {zGL_WebGL_lib} from './libs/ZGL.lib.WebGL.m.js';


var Module = {
	SYS_LIB : {
		FuncScopeRedefiner      : FuncScopeRedefiner,
		insert_prototype        : ObjectPropertiesLib.insert_prototype,
		add_objectStackProperty : ObjectPropertiesLib.add_objectStackProperty,
	},
	GFX_LIBS : {
		WebGL : zGL_WebGL_lib,
	}
};
var ZGL = get_ZGL_class(Module);

// ADD EXTENSIONS
ZGL.ext.Math     = Math;
ZGL.ext.Geometry = Geometry;
ZGL.ext.FBX      = FBX;
ZGL.ext.Loader   = Loader;
ZGL.ext.Shader   = Shader;



// test
var vbo = function(data){
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};

var LIBs = {
	vbo99 : function(data){
		gl.clearColor(1, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		var z = 0;
		for(let i=0; i<100; i++)
			z = (2**i) / (i+1);
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





ZGL.lib.vbo = vbo;
ZGL.lib = LIBs;
delete ZGL.lib.vbo8;










// EXPORT
export {ZGL};