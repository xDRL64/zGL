this.ZGL_Initializer = (function(){


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
	}


	return new (function(PROTECTED_SCOPE){
	
		this.ZGL_Class = null;
	
		var _lib = {};
		Object.defineProperties(this, {'lib':{
			get : function(){ return _lib; },
			set : function(val){
				if(typeof val === 'object')
					Object.assign(_lib, val);
			},
		}});
		this.ZGL_lib = _lib;
	
		var _ext = {};
		Object.defineProperties(this, {'ext':{
			get : function(){ return _ext; },
			set : function(val){
				if(typeof val === 'object')
					Object.assign(_ext, val);
			},
		}});
		this.ZGL_ext = _ext;
	
		

		this.ZGL_SYS_LIB = {
	
			FuncScopeRedefiner : PROTECTED_SCOPE.FuncScopeRedefiner,
	
			inject_extensions : function(){
				var extNameList = [];
				// INJECTION PROCESS
				for(let extName in _ext){
					// SET DEPENDENCES
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
	
			argsWrapper : function(args){
	
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
	
		};
	
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
	
	})(this.PROTECTED_SCOPE);

})();

