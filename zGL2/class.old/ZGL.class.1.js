var ZGL = (function(){

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
	
			// REDEFINI LE SCOPE POUR TOUTES LES METHODES
			// ASSIGNE TOUTES LES METHODES A ZGL
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

		var argsWrapper = function(args){};

		// ZGL CLASS
		var ZGL = function(canvasDomElem){
	
			// CANVAS (DOM ELEMENT)
			canvasDomElem = canvasDomElem || document.createElement('CANVAS');
			this.domElem = canvasDomElem;
		
			// WEBGL API CONTEXT
			var gl = canvasDomElem.getContext('webgl');
			this.gl = gl;
		
			// LIB SCOPE SETTINGS
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

			// INTI LIB SCOPE
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
	var my = 0;
	
    console.log("zgl : ", zgl);
    console.log("gl : ", gl);
    console.log("this : ", this);
    console.log("_lib : ", _lib);
};


ZGL.lib.ggg = (function(){});
ZGL.lib.fff = ZGL.lib.vbo;
ZGL.lib.ffsf = vbo;


var fff = function(A, B){
	console.log(arguments);

	var viewport = document.getElementById('vi');

	console.log("test : ", viewport instanceof HTMLCanvasElement);

	
};