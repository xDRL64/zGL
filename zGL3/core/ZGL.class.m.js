"use strict";


var ZGL_Class = function(){
	var test = this.constructor.Module.SYS_LIB.FuncScopeRedefiner;
	debugger
};

ZGL_Class.Module = {
	SYS_LIB : null,
};


function tmp()
{
	//var _lib = this.ZGL_Initializer.ZGL_lib;
	var _lib = {};
	//var _ext = this.ZGL_Initializer.ZGL_ext;
	var _ext = {};
	

	//var FuncScopeRedefiner = this.ZGL_Initializer.ZGL_SYS_LIB.FuncScopeRedefiner;

	//var argsWrapper = this.ZGL_Initializer.ZGL_SYS_LIB.argsWrapper;
	var argsWrapper = function(){};

	/* var inject_extensions = FuncScopeRedefiner.set(
		this.ZGL_Initializer.ZGL_SYS_LIB.inject_extensions,
		{_ext:_ext, FuncScopeRedefiner:FuncScopeRedefiner}
	).get_result(); */
	var inject_extensions = FuncScopeRedefiner.set(
		function(){},
		{_ext:{}, FuncScopeRedefiner:FuncScopeRedefiner}
	).get_result() || {};



	// ZGL CLASS
	/**
	 * @param canvas  : ('elem':HTMLCanvasElement || 'cssID':string)
	 * @param context : string
	 */
	var ZGL = function( /* See param Instruction */ ){

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

		// INJECT EXTENSIONS
		inject_extensions.call(this);
	};


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
	

	//ZGL.EXTENSION_CORE_LIB = this.ZGL_Initializer.EXTENSION_CORE_LIB;
	ZGL.EXTENSION_CORE_LIB = {};
}
export {ZGL_Class};


