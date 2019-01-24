this.ZGL_Initializer.ZGL_Class = (function(){



	var _lib = this.ZGL_Initializer.ZGL_lib;
	var _ext = this.ZGL_Initializer.ZGL_ext;
	

	var FuncScopeRedefiner = this.ZGL_Initializer.ZGL_SYS_LIB.FuncScopeRedefiner;

	var argsWrapper = this.ZGL_Initializer.ZGL_SYS_LIB.argsWrapper;

	var inject_extensions = FuncScopeRedefiner.set(
		this.ZGL_Initializer.ZGL_SYS_LIB.inject_extensions,
		{_ext:_ext, FuncScopeRedefiner:FuncScopeRedefiner}
	).get_result();



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

	//this.ZGL_Initializer.lib = _lib;
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
	

	ZGL.EXTENSION_CORE_LIB = this.ZGL_Initializer.EXTENSION_CORE_LIB;

	return ZGL;
})();




// ZGL.ext.propNameOfTheExtension = extension (function or object)

// créer une instance (chaque instance de ZGL a sa propre extension)
// l'extension possède un access à l'instance ZGL qui la contient
// declanche automatiquement la methode __INIT__ de l'extension pendant l'ajout de l'extension à l'instance ZGL
// declanche automatiquement la methode __LINK__ de l'extension apres l'ajout de toutes les extensions à l'instance ZGL
// la methode __LINK__ recoi en arg 0 : la list des noms de toutes les extensions ajoutées à l'instance ZGL
// ZGL.ext.exemple = function(zgl){this.a=1, this.b=2};

// copie la reference de l'objet (toutes les instances de ZGL partage l'extension)
// l'extension ne possède pas d'access à l'instance ZGL qui la contient
// ZGL.ext.exemple = {a:3,b:4};


// ZGL.lib.functionName = functionObject
// ZGL.lib.exemple = function(){ console.log('cette methode de zGL a besoin de : ', gl) };



