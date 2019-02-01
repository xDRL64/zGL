"use strict";

import {ZGL_Class} from './core/ZGL.class.m.js';

import {FuncScopeRedefiner} from './dependences/TinyTools/FuncScopeRedefiner.m.js';

import {Math}     from './extensions/ZGL.ext.Math.m.js';
import {Geometry} from './extensions/ZGL.ext.Geometry.m.js';



var Module = {
	SYS_LIB : {
		FuncScopeRedefiner : FuncScopeRedefiner,
	}
};
var ZGL = ZGL_Class(Module);






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

debugger

ZGL.ext.Math = Math;
ZGL.ext.Geometry = Geometry;






// EXPORT
export {ZGL};