"use strict";

var ZGL_Class = function(Module){

	// PRIVATE STATIC METHODS
	var FuncScopeRedefiner = Module.SYS_LIB.FuncScopeRedefiner;
	var insert_prototype   = Module.SYS_LIB.insert_prototype;

	var defLibConstructorBuilder = Module.GL_LIB.constructorBuilder;

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
		var glDefLib = new defLibConstructorBuilder(gl);
		/* var ZGL_prototype = Object.getPrototypeOf(this);
		Object.setPrototypeOf(glDefLib, ZGL_prototype);
		Object.setPrototypeOf(this, glDefLib); */
		insert_prototype(this, glDefLib);

		// LIB SCOPE SETTINGS
		let libScope = {
			gl  : gl,
			zgl : this,
		};
		Object.assign( this, FuncScopeRedefiner.set(_lib, libScope).get_result() );

		// ADD EXTENSIONS
		Object.assign( this, _ext);
	}

	Object.defineProperties(ZGL, {'lib':{
		get : function(){ return _lib; },
		set : function(val){
			if(typeof val === 'object')
				Object.assign(_lib, val);
		},
	}});

	Object.defineProperties(ZGL, {'ext':{
		get : function(){ return _ext; },
		set : function(val){
			if(typeof val === 'object')
				Object.assign(_ext, val);
		},
	}});

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


export {ZGL_Class};


