"use strict";

function insert_prototype (object, prototype) {
	var currentPrototype = Object.getPrototypeOf(object);
	Object.setPrototypeOf(prototype, currentPrototype);
	Object.setPrototypeOf(object, prototype);
}

function add_objectStackProperty (object, publicName, privateObjVar) {
	var props = {};
	props[publicName] = {
		get : function(){ return privateObjVar; },
		set : function(val){
			if(typeof val === 'object')
				Object.assign(privateObjVar, val);
		}
	};
	Object.defineProperties(object, props);
}




var ObjectPropertiesLib = {
	insert_prototype        : insert_prototype,
	add_objectStackProperty : add_objectStackProperty,
};




export {
	insert_prototype,
	add_objectStackProperty,

	ObjectPropertiesLib,
};