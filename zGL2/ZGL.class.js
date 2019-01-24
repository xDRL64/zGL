var ZGL = (function(){


	// METHODES OF ZGL NEEDS PRIVATE AND EMPTY SCOPE
	this.PROTECTED_SCOPE = {

		set_libScope : function( /* DON'T PASS ARGS BECAUSE THEY WILL STAY IN THE SCOPE */ ){

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

		//var classMethods = this.PROTECTED_SCOPE;
		var set_libScope = this.PROTECTED_SCOPE.set_libScope;
		delete this.PROTECTED_SCOPE;

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

		var make_scopeLibSettings = function(libScope){
			let methods = [];
			for(let method in _lib){
				methods.push({
					name : method,
					code : _lib[method].toSource()
				});
			}
			return {
				methods : methods,
				scope   : libScope,
			};
		};

		/* var inject_extensions = function(){
			var extNameList = [];
			for(let extName in _ext){
				let ext = _ext[extName];
				if(typeof ext === 'function')
					this[extName] = new ext(this);
				else
					this[extName] = ext;
				extNameList.push(extName);
			}
			return extNameList;
		}; */

		var inject_extensions = function(){
			var extNameList = [];
			// INJECT EXTENSIONS
			for(let extName in _ext){
				let ext = _ext[extName];
				if(typeof ext === 'function'){
					this[extName] = new ext(this);
					if(this[extName].__INIT__)
						this[extName].__INIT__();
				}
				else
					this[extName] = ext;
				extNameList.push(extName);
			}
			// INIT EXTENSION
			for(let extName of extNameList){
				if(this[extName].__LINK__)
					this[extName].__LINK__(extNameList);
			}
			return extNameList;
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
			let libScope = {
				gl  : gl,
				zgl : this,
			};
			// KEEP 'libScopeSettings' in 'this' until 'set_libScope' using
			// BECAUSE 'set_libScope' must take no arguments BUT needs to access 'libScopeSettings'
			this.libScopeSettings = make_scopeLibSettings(libScope);
			// INTI LIB SCOPE
			set_libScope.call(this);
			delete this.libScopeSettings;

			// INJECT EXTENSIONS
			let extNameList = inject_extensions.call(this);


			// todo : execute init of each extension

		};
	
		ZGL.lib = _lib;
		ZGL.ext = _ext;
	
		return ZGL;
	})();


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



