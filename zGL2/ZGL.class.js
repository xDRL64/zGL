var ZGL = (function(){


	// METHODES OF ZGL NEED PRIVATE AND EMPTY SCOPE
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
		var _ext = {};

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
		};

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

			// INJECT EXTENSIONS
			this.inject_extensions = function(){
				for(let extName in _ext){
					let ext = _ext[extName];
					if(typeof ext === 'function')
						this[extName] = new ext();
					else
						this[extName] = ext;
				}
			};
			this.inject_extensions();
			
		};
	
		ZGL.lib = _lib;
		ZGL.ext = _ext;
	
		return ZGL;
	})();


})();

ZGL.ext.loaderr = function(){this.a=1, this.b=2};
ZGL.ext.loaderr2 = {a:3,b:4};
ZGL.ext.loaderr3 = function(){};

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