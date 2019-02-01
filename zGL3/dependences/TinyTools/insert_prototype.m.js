"use strict";

function insert_prototype (object, prototype) {
	var currentPrototype = Object.getPrototypeOf(object);
	Object.setPrototypeOf(prototype, currentPrototype);
	Object.setPrototypeOf(object, prototype);
}

export {insert_prototype};