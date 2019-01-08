var ZGL = (function(){

	var set_libScope2 = function(){
			var gl = this.libScopeSettings.gl;
			this.libScopeSettings.names = Object.keys(this.libScopeSettings.lib);
			this.libScopeSettings.name = "";
			for(this.libScopeSettings.name of this.libScopeSettings.names){
				let method = this.libScopeSettings.lib[this.libScopeSettings.name];
				let code   = method.toSource();
				this[this.libScopeSettings.name] = eval(code);
			}
	};
	var set_libScope3 = function(){
		//debugger
		this.LSS = this.libScopeSettings;

		// CREER LES VARIABLE ACCESSIBLE DANS LE SCOPE
		//var gl = this.LSS.gl;
		for(let varName in this.LSS.scope)
			eval('var '+varName+' = this.LSS.scope[varName]');

		// REDEFINI LE SCOPE POUR TOUT LES METHODES
		this.LSS.method = null;
		for(this.LSS.method of this.LSS.methods)
			this[this.LSS.method.name] = eval(this.LSS.method.code);
		
		delete this.LSS.method;
		delete this.LSS;
	};



	// METHODES OF ZGL NEED PRIVATE SCOPE
	this.ZGL = {

		set_libScope : function(){

			// TEMP RAM
			this.LSS = this.libScopeSettings;
			this.TMP = {};
			this.TMP.method = null;
			this.TMP.varName = '';

			// CREER LES VARIABLE ACCESSIBLE DANS LE SCOPE
			for(this.TMP.varName in this.LSS.scope)
				eval('var '+this.TMP.varName+' = this.LSS.scope[this.TMP.varName]');
	
			// REDEFINI LE SCOPE POUR TOUT LES METHODES
			this.TMP.method = null;
			for(this.TMP.method of this.LSS.methods)
				this[this.TMP.method.name] = eval(this.TMP.method.code);
			
			// CLEAN TMP RAM
			delete this.LSS;
			delete this.TMP.method;
			delete this.TMP.varName;
			delete this.TMP;
		},

	};

	// PARENT SCOPE OF ZGL
	return (function(){

		var classMethods = this.ZGL;

		var _lib = {};

		// ZGL CLASS
		var ZGL = function(canvasDomElem){
	
			canvasDomElem = canvasDomElem || document.createElement('CANVAS');
			this.domElem = canvasDomElem;
		
			var gl = canvasDomElem.getContext('webgl');
			this.gl = gl;
		
			this.libScopeSettings = null;
			this.make_scopeLibSettings = function(){
				let methods = [];
				for(let method in _lib){
					methods.push({
						name : method,
						code : _lib[method].toSource()
					});
				}
				this.libScopeSettings = {
					methods : methods,
					scope : {
						gl : gl,
						zgl : this,
					},
				};
			};
			this.make_scopeLibSettings();

			this.set_libScope = classMethods.set_libScope;
			this.set_libScope();
			
		};
	
		ZGL.lib = _lib;
	
		return ZGL;
	})();

	

})();



var vbo = function(data){
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};

ZGL.lib.vbo = function(data){
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};

ZGL.lib.vbo2 = function(data){
	//debugger
    console.log("zgl : ", zgl);
    console.log("gl : ", gl);
    console.log("this : ", this);
    console.log("_lib : ", _lib);
};


ZGL.lib.ggg = (function(){});
ZGL.lib.fff = ZGL.lib.vbo;
ZGL.lib.ffsf = vbo;