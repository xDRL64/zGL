"use strict";

var FuncScopeRedefiner = {
	newScope   : null,
	funcObject : null,

	set : function(funcObject, newScope){
		this.funcObject = funcObject;
		this.newScope = newScope;
		return this;
	},

	get_result : function(){
		// SCOPE TEMP
		this._name = '';
		this._varCode = '';
		this._funcCode = '';
		this._output = null;
		
		// make scope variables code
		for(this._name in this.newScope)
			this._varCode += 'var '+this._name+' = this.newScope["'+this._name+'"];';

		// ONE FUNCTION REDEFINITION
		if(typeof this.funcObject === 'function')
			this._output = eval( this._varCode+'('+this.funcObject.toString()+')' );
		
		// SOME FUNCTION REDEFINITIONS
		if(typeof this.funcObject === 'object'){
			// make functions object code
			this._funcCode += 'var funcObj = {';
			for(this._name of Object.keys(this.funcObject))
				this._funcCode += this._name+' : '+'('+this.funcObject[this._name].toString()+'),';

			this._output = eval( this._varCode+this._funcCode+'}; funcObj' );
		}

		// FREE SCOPE TEMP
		return (function(object){
			let output = object._output;
			delete object._name;
			delete object._varCode;
			delete object._funcCode;
			delete object._output;
			// get result
			return output;
		})(this);
			
	}
};

/* 
var func0 = function(){
	console.log(a,b);
};
var func1 = function(){
	console.log(a,b);
};

var newScope = {a:1, b:2};

var pack = FuncScopeRedefiner.set({func0:func0,func1:func1},newScope).get_result();

pack.func0();
console.log('----');
pack.func1();
 */


export {FuncScopeRedefiner};