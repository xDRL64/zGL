"use strict";

import { _ShaderInput } from './ZGL._ShaderInput.class.m.js';


var zGL_Attribute_Class = (function(gl){

	// class
	//

	function _Attribute(location, dataInfo){

		// heritage
		// -> this.location
		// -> this.dataInfo
		// -> this.data(get/set)
		_ShaderInput.apply(this, arguments);

		// code
		if(typeof dataInfo === 'object'){
			this.size       = dataInfo.size       || 3;
			this.type       = dataInfo.type       || gl.FLOAT;
			this.normalized = dataInfo.normalized || false;
			this.stride     = dataInfo.stride     || 0;
			this.offset     = dataInfo.offset     || 0;
		}else{
			this.size       = dataInfo;
			this.type       = gl.FLOAT;
			this.normalized = false;
			this.stride     = 0;
			this.offset     = 0;
		}

		this.start = this.start;
	}

	// heritage
	//

	_Attribute.prototype = Object.create(_ShaderInput.prototype);
	_Attribute.prototype.constructor = _Attribute;
	Object.setPrototypeOf(_Attribute, _ShaderInput);

	// public static props
	//

	_Attribute.activateds = new Array(256);
	_Attribute.activateds.fill(false);

	// public methods
	//

	_Attribute.prototype.start = function(){
		gl.bindBuffer(gl.ARRAY_BUFFER, this.data);
		gl.vertexAttribPointer(this.location, this.size, this.type, this.normalized, this.stride, this.offset);
	}

	return _Attribute;
});


export { zGL_Attribute_Class };