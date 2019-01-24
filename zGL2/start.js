zgl = new ZGL();
//debugger
zgl.Loader.addToLoading("myFbx", "any", "teapot.fbx");
var afterLoading = function(){
	fbx = zgl.FBX.parse(zgl.Loader.data.myFbx);
	console.log(fbx);
	zglMesh = zgl.FBX.import(fbx, 'Utah_Teapot_Quads');
	console.log(zglMesh);
	//props = zgl.FBX.get_availableProps(zglMesh);
	//console.log(props);
};
zgl.Loader.callback = afterLoading;
zgl.Loader.load();








var functionScopeRedefiner = {
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
			eval('var '+name+' = injections[name]');

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
};

/* 
var func0 = function(){
	console.log(a,b);
	this.method = function(){console.log("la:",a,b);};
};
var func1 = function(){
	console.log(a,b);
};
var func2 = function(){
	console.log(a,b);
};

var injections = {a:11, b:22, math2:"1234"};

var pack = functionScopeRedefiner.set({func0:func0,func1:func1},injections).get_result();
var pack2 = functionScopeRedefiner.set(func2,{a:11, b:22}).get_result();

var inst = new pack.func0();
inst.method();
console.log('----');
//pack.func1();
console.log('----');
pack2();


var Geo = functionScopeRedefiner.set(ZGL_ext_Geometry,{math2:"1234"}).get_result();
var geo = new Geo();
geo.test_math();
 */

/* 
var functionScopeRedefiner = {
	injections : null,
	funcObject : null,

	set : function(funcObject, injections){
		this.funcObject = funcObject;
		this.injections = injections;
		return this;
	},

	get_result : function(){
		for(let name in this.injections)
			eval('var '+name+' = injections[name]');

		if(typeof funcObject === 'function')
			return eval('('+this.funcObject.toString()+')');
		if(this.funcObject instanceof Array)
			return this.funcObject.map( f => eval('('+f.toString()+')') );

	}
}; */
/* 
var func0 = function(){
	console.log(a,b);
};
var func1 = function(){
	console.log(a,b);
};

var injections = {a:1, b:2};

var pack = functionScopeRedefiner.set([func0,func1],injections).get_result();

pack[0]();
console.log('----');
pack[1]();
 */




/* 
var functionScopeRedefiner2 = {
	injections : null,
	funcObject : null,

	set : function(funcObject, injections){
		this.funcObject = funcObject;
		this.injections = injections;
		return this;
	},

	get_result : function(){
		for(let name in this.injections)
			eval('var '+name+' = injections[name]');
		return eval('('+this.funcObject.toString()+')');
	}
};

var func = function(){
	console.log(a,b, nameqq);
};

var injections = {a:1, b:2};

var newFunc = functionScopeRedefiner2.set(func,injections).get_result();

newFunc();
 */

















/* 
var link2scope = function(object, method, func, injections){

	var code = func.toString();
	for(let name in injections)
		eval('var '+name+' = injections[name]');
	
	object[method] = eval('('+code+')');
};

var object = {};

var method = 'testMthd';

var injections = {a:1, b:2};

var func = function(){
	console.log(object, method, func, injections);
	console.log(a,b);
};

link2scope(object, method, func, injections);
console.log("!!!!!!!!!!");
object[method]();
 */









