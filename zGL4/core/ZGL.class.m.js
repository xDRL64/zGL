"use strict";

var ZGL_Class = function(Module){

	// PRIVATE STATIC METHODS
	var FuncScopeRedefiner      = Module.SYS_LIB.FuncScopeRedefiner;
	var insert_prototype        = Module.SYS_LIB.insert_prototype;
	var add_objectStackProperty = Module.SYS_LIB.add_objectStackProperty;

	var gfxLibs = Module.GFX_LIBS;

	// PRIVATE STATIC PROPERTIES
	var _lib = {};
	var _ext = {};

	// ZGL CLASS
	/**
	 * @param canvas  : ('elem':HTMLCanvasElement || 'cssID':string)
	 * @param context : string
	 */
	function ZGL ( /* See param Instruction */ ) {

		// SET :
		// --> this.domElem
		// --> this.contextType
		argsWrapper.call(this, arguments);

		// WEBGL API CONTEXT
		var gl = this.domElem.getContext(this.contextType);
		this.gl = gl;
	
		// MAKE DEFAULT GL LIB
		var GfxLib = get_GfxLib.call(this, gfxLibs);
		var gfxLib = new GfxLib(gl);
		insert_prototype(this, gfxLib);

		// LIB SCOPE SETTINGS
		let libScope = {
			gl  : gl,
			zgl : this,
		};
		Object.assign( this, FuncScopeRedefiner.set(_lib, libScope).get_result() );

		// ADD EXTENSIONS
		Object.assign( this, _ext);
	}

	add_objectStackProperty(ZGL, 'lib', _lib);
	add_objectStackProperty(ZGL, 'ext', _ext);


	return ZGL;

};


var argsWrapper = function(args){
	
	// CHECK 1ST ARG : CANVAS DOM ELEMENT
	let arg = args[0];
	if(arg instanceof HTMLCanvasElement)
		this.domElem = arg;
	else if(typeof arg === 'string'){
		let elem = document.getElementById(arg);
		if(elem instanceof HTMLCanvasElement)
			this.domElem = elem;
		else
			this.domElem = document.createElement('CANVAS');
	}else
		this.domElem = document.createElement('CANVAS');
	
	// CHECK 2ND ARG : WEBGL CONTEXT TYPE
	arg = args[1];
	if(typeof arg === 'string'){
		let goodContextType = false;
		goodContextType += arg=='webgl';
		goodContextType += arg=='webgl2';
		goodContextType += arg=='experimental-webgl';
		this.contextType = goodContextType? arg : 'webgl';
	}else
		this.contextType = 'webgl';
}

var get_GfxLib = function(gfxLibs){
	return this.contextType==='webgl'||this.contextType==='experimental-webgl'
		? gfxLibs.WebGL
		: this.contextType==='webgl2'
			? gfxLibs.WebGL2
			: console.error("zGL fatal err -> get_GfxLib : contextType is not defined");
};



export {ZGL_Class};


