var ZGL = (function(){


	// METHODES OF ZGL NEEDS PRIVATE AND EMPTY SCOPE
	this.PROTECTED_SCOPE = {

		FuncScopeRedefiner : {
			injections : null,
			funcObject : null,
		
			set : function(funcObject, injections){
				this.funcObject = funcObject;
				this.injections = injections;
				return this;
			},
		
			get_result : function(){
				// SCOPE INIT
				for(let name in this.injections)
					eval('var '+name+' = this.injections[name]');
		
				// FUNCTION REDEFINITION
				if(typeof this.funcObject === 'function')
					return eval('('+this.funcObject.toString()+')');
				// FUNCTION REDEFINITIONS
				if(typeof this.funcObject === 'object'){
					this.o = {};
					this.name = null;
					for(this.name of Object.keys(this.funcObject))
						this.o[this.name] = eval('('+this.funcObject[this.name].toString()+')');
					delete this.name;
					return (function(object, prop){
						let output = object[prop];
						delete object[prop];
						return output;
					})(this, 'o');
				}
					
			}
		},

		inject_extensions : function(){
			var extNameList = [];
			// INJECTION PROCESS
			for(let extName in _ext){
				// SET DEPENDENCES
				//this.init_forDependencies(extName);
				let tmp = new _ext[extName]();
				if(tmp.DEPS && tmp.DEPS.length>0){
					let extScope = {};
					for(let dep of tmp.DEPS)
						extScope[dep.name] = null;
					_ext[extName] = FuncScopeRedefiner.set(_ext[extName], extScope).get_result();
				}
				// INJECT EXTENSIONS
				let ext = _ext[extName];
				if(typeof ext === 'function'){
					this[extName] = new ext(this);
					// INIT EXTENSION
					if(this[extName].__INIT__)
						this[extName].__INIT__();
				}
				else
					this[extName] = ext;
				extNameList.push(extName);
			}
			// LINK EXTENSIONS
			for(let extName of extNameList){
				if(this[extName].__LINK__)
					this[extName].__LINK__(extNameList, extName);
			}
		},

		/* init_forDependencies : function(extName){
			var tmp = new _ext[extName]();
			if(tmp.DEPS && tmp.DEPS.length>0){
				var extScope = {};
				for(let dep of tmp.DEPS)
					extScope[dep.name] = null;
				_ext[extName] = this.FuncScopeRedefiner.set(_ext[extName], extScope).get_result();
			}
		}, */

	};


	// PARENT SCOPE OF ZGL
	return (function(){

		var _lib = {};
		var _ext = {};

		var FuncScopeRedefiner = this.PROTECTED_SCOPE.FuncScopeRedefiner;

		//var inject_extensions = this.PROTECTED_SCOPE.inject_extensions;
		var inject_extensions = FuncScopeRedefiner.set(
			this.PROTECTED_SCOPE.inject_extensions,
			{_ext:_ext, FuncScopeRedefiner:FuncScopeRedefiner}
		).get_result();

		delete this.PROTECTED_SCOPE;

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

		/* var inject_extensions = function(){
			var extNameList = [];
			// INJECT EXTENSIONS
			for(let extName in _ext){
				init_forDependencies(extName);
				let ext = _ext[extName];
				if(typeof ext === 'function'){
					this[extName] = new ext(this);
					// INIT EXTENSION
					if(this[extName].__INIT__)
						this[extName].__INIT__();
				}
				else
					this[extName] = ext;
				extNameList.push(extName);
			}
			// LINK EXTENSIONS
			for(let extName of extNameList){
				if(this[extName].__LINK__)
					this[extName].__LINK__(extNameList, extName);
			}

		}; */

		/* var init_forDependencies = function(extName){
			var tmp = new _ext[extName]();
			if(tmp.DEPS && tmp.DEPS.length>0){
				var extScope = {};
				for(let dep of tmp.DEPS)
					extScope[dep.name] = null;
				_ext[extName] = FuncScopeRedefiner.set(_ext[extName], extScope).get_result();
			}
		}; */

		this.EXTENSION_CORE_LIB = {
			__LINK__code : '('+(function(extNameList, name){
				if(this.DEPS && this.DEPS.length>0)
					for(let dep of this.DEPS){
						let found = false;
						for(let extName of extNameList)
							if(zgl[extName].NAME === dep.src){
								eval(dep.name+' = zgl[extName];');
								found = true;
							}
						if(!found) console.warn('Dependence : '+dep.name+' of ZGL.'+name+' is not found !');
					}
			}).toString()+')',
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
			Object.assign( this, FuncScopeRedefiner.set(_lib, libScope).get_result() );

			// INJECT EXTENSIONS
			inject_extensions.call(this);
		};
	
		ZGL.lib = _lib;
		ZGL.ext = _ext;

		ZGL.EXTENSION_CORE_LIB = this.EXTENSION_CORE_LIB;
		delete this.EXTENSION_CORE_LIB;
	
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



