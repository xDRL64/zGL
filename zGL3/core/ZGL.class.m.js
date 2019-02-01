"use strict";

var ZGL_Class = function(Module){

	// PRIVATE STATIC METHODS
	var FuncScopeRedefiner = Module.SYS_LIB.FuncScopeRedefiner;

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


