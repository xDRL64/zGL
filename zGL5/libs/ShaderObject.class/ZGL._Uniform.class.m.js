"use strict";

import { _ShaderInput } from './ZGL._ShaderInput.class.m.js';


var zGL_Uniform_Class = (function(gl){
		
	// class
	//

	function _Uniform(index, name, location, dataInfo){

		// heritage
		// -> this.location
		// -> this.dataInfo
		// -> this.data(get/set)
		_ShaderInput.apply(this, arguments);

		// private props
		//
		
		// public

		// use like this : glSendMethod( uniformData )
		this.glSendMethod = (function(){
			var _GL = _list[dataInfo];
			var args = [];
			args.push(location);
			if(dataInfo.includes("mat"))
				args.push(false);
			return _GL.method.bind(gl, ...args);
		})();
		
			
		this.start         = this.start;
		this.externalStart = this.externalStart;
		//this._old_start_   = _start.bind(this, _GL, args);
		//this.externalStart = _externalStart.bind(this, _GL, args);
	}

	// heritage
	//

	_Uniform.prototype = Object.create(_ShaderInput.prototype);
	_Uniform.prototype.constructor = _Uniform;
	Object.setPrototypeOf(_Uniform, _ShaderInput);

	// public methods
	//

	_Uniform.prototype.start = function(){
		this.glSendMethod( this.data );
	};
	_Uniform.prototype.externalStart = function(data){
		this.glSendMethod( data );
	};

	// private methods
	//

	/* function _start(_GL, args){
		args[_GL.iLastArg] = this.data;
		_GL.method.apply(gl, args);
	} */

	/* function _externalStart(_GL, args, data){
		args[_GL.iLastArg] = data;
		_GL.method.apply(gl, args);
	} */
	
	function _connect_texture(location, data){
		var iTex = _Uniform.iTexture;
		//gl.activeTexture(gl.TEXTURE+(iTex<10?'0':'') + iTex);
		gl.activeTexture(gl.TEXTURE0 + iTex);
		_Uniform.iTexture++;
		gl.bindTexture(gl.TEXTURE_2D, data);
		gl.uniform1i(location, iTex);
	}




	window.unifs = ({

		_matArr : ['mat4', 3],

		_pl : {
			prop_0 : 'vec3',
			prop_1 : {
				prop_0 : 'vec3',
				prop_1 : 'vec3'
			},

		},

		_al : [

			{
				prop_0 : 'vec3',
				prop_1 : {
					prop_0 : 'vec3',
					prop_1 : 'vec3',
					prop_2 : ['mat4', 3],
				},

			},

			3

		]

	});



	// public satic props
	//
	_Uniform.iTexture = 0;


	// private satic props
	//

	var _list = {
		'float'     : { method:gl.uniform1f,        iLastArg:1 },
		'int'       : { method:gl.uniform1i,        iLastArg:1 },
		'vec2'      : { method:gl.uniform2fv,       iLastArg:1 },
		'ivec2'     : { method:gl.uniform2iv,       iLastArg:1 },
		'vec3'      : { method:gl.uniform3fv,       iLastArg:1 },
		'ivec3'     : { method:gl.uniform3iv,       iLastArg:1 },
		'vec4'      : { method:gl.uniform4fv,       iLastArg:1 },
		'ivec4'     : { method:gl.uniform4iv,       iLastArg:1 },
		'mat2'      : { method:gl.uniformMatrix2fv, iLastArg:2 },
		'mat3'      : { method:gl.uniformMatrix3fv, iLastArg:2 },
		'mat4'      : { method:gl.uniformMatrix4fv, iLastArg:2 },
		'sampler2D' : { method:_connect_texture,    iLastArg:1 },
	}
	

	return _Uniform;
});

export { zGL_Uniform_Class };