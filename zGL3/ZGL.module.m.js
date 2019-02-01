"use strict";

// CLASS
import {ZGL_Class as get_ZGL_class} from './core/ZGL.class.m.js';

// SYS LIB
import {FuncScopeRedefiner} from './dependences/TinyTools/FuncScopeRedefiner.m.js';
import {insert_prototype} from './dependences/TinyTools/insert_prototype.m.js';

// EXTENSIONS
import {Math}     from './extensions/ZGL.ext.Math.m.js';
import {Geometry} from './extensions/ZGL.ext.Geometry.m.js';
import {FBX}      from './extensions/ZGL.ext.FBX.m.js';
import {Loader}   from './extensions/ZGL.ext.Loader.m.js';

// DEFAULT GL LIB
import {zGL_Default_lib}   from './libs/ZGL.lib.Default.m.js';


var Module = {
	SYS_LIB : {
		FuncScopeRedefiner : FuncScopeRedefiner,
		insert_prototype   : insert_prototype,
	},
	GL_LIB : {
		constructorBuilder : zGL_Default_lib,
	}
};
var ZGL = get_ZGL_class(Module);

// ADD EXTENSIONS
ZGL.ext.Math     = Math;
ZGL.ext.Geometry = Geometry;
ZGL.ext.FBX      = FBX;
ZGL.ext.Loader   = Loader;



// test
var vbo = function(data){
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

ZGL.lib.vbo = vbo;
ZGL.lib = LIBs;
delete ZGL.lib.vbo8;










// EXPORT
export {ZGL};