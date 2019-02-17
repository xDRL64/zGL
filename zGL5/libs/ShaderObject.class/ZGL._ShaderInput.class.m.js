"use strict";

// attribute dataInfo : size || {size, type, normalized, stride, offset}
// uniform dataInfo : dataType:{'int', 'float', 'ivec2', 'vec2', 'ivec3', 'vec3', 'ivec4', 'vec4', 'mat2', 'mat3', 'mat4', 'sampler2D'}
function _ShaderInput(index, name, location, dataInfo){
	this.index    = index;
	this.name     = name;
	this.location = location;
	this.dataInfo = dataInfo;
	var data = null;
	Object.defineProperty(this, 'data', {
		get : () => data,
		set : (value) => data = value
	});
}


export { _ShaderInput };