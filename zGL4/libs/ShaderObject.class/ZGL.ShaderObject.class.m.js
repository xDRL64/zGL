"use strict";



import { zGL_Attribute_Class as get_Attribute_class } from './ZGL._Attribute.class.m.js';
import { zGL_Uniform_Class   as get_Uniform_class }   from './ZGL._Uniform.class.m.js';

import { insert_prototype }   from '../../dependences/TinyTools/ObjectPropertiesLib.m.js';

	


// ShaderObject Using :

// 0. Create instance : give glsl codes, attributes to get, uniforms to get

// 1. change the attribs/uniforms data value before re-/starting ShaderObject to draw

// 2. run the shaderInstance.start method

// 3. to draw

// And So On...

// 4. change the attribs/uniforms data value before re-/starting ShaderObject to draw

// 5. run the shaderInstance.start method

// 6. to draw


/* codes      = { vertex:string, fragment:string }
	attributes = { name:dataInfo, ..., ..., ...,  }
	uniforms   = { name:dataInfo, ..., ..., ...,  } */
// attribute dataInfo : size || {size, type, normalized, stride, offset}
// uniform dataInfo : dataType/TextureId
var zGL_ShaderObject_Class = (function(gl, shaderLib){


	var _build         = shaderLib._build;
	var vBuild         = shaderLib.vBuild;
	var fBuild         = shaderLib.fBuild;
	var shader         = shaderLib.shader;
	var get_attributes = shaderLib.get_attributes;
	var get_uniforms   = shaderLib.get_uniforms;



	var _Attribute = get_Attribute_class(gl);
	var _Uniform   = get_Uniform_class(gl);
	

	// class
	//
	function ShaderObject(codes={}, attributes={}, uniforms={}){
		
		var vBin = vBuild(codes.vertex);
		var fBin = fBuild(codes.fragment);

		this.prog = shader(vBin,fBin);

		var A_names = Object.keys(attributes);
		var U_names = Object.keys(uniforms);

		var A_locations = get_attributes(this.prog, A_names);
		var U_locations = get_uniforms(this.prog, U_names);

		this.attributes = {};
		insert_prototype( this.attributes, {array:[]} );
		A_names.forEach( (name)=>{
			this.attributes[name] = new _Attribute(A_locations[name], attributes[name]);
			this.attributes.array.push( this.attributes[name] );
		} );

		this.uniforms = {};
		insert_prototype( this.uniforms, {array:[]} );
		U_names.forEach( (name)=>{
			this.uniforms[name] = new _Uniform(U_locations[name], uniforms[name]);
			this.uniforms.array.push( this.uniforms[name] );
		} );

		this.start = this.start;


	}

	// private props
	//

	

	// private methods
	//

	function _update_enabledAttribs(shaderObj){
		// active/desactive l'interpolation en fonction du nombre d'attributes pour 'this' instance de ShaderObject 
		var firstDisabled = _Attribute.activateds.indexOf(false);
		var diff = shaderObj.attributes.array.length - firstDisabled;
	
		// (CODE CONTENT : hardcore otpimisation)
		if(diff < 0)
			// disable
			for(let i=0; i>diff; i--){
				let iAttr = firstDisabled + i - 1;
				_Attribute.activateds[iAttr] = false;
				gl.enableVertexAttribArray(iAttr);
			}
		else
			// enable
			for(let i=0; i<diff; i++){
				let iAttr = firstDisabled + i;
				_Attribute.activateds[iAttr] = true;
				gl.enableVertexAttribArray(iAttr);
			}
	}

	// public methods
	//

	ShaderObject.prototype.start = function(){

		_update_enabledAttribs(this);

		gl.useProgram(this.prog);

		this.attributes.array.forEach( (attr)=>{attr.start();} );

		_Uniform.iTexture = 0;
		this.uniforms.array.forEach( (unif)=>{unif.start();} );

	}

	ShaderObject.prototype.tell = function(){
		console.log(_Attribute.activateds);
	}

	return ShaderObject;
});



export { zGL_ShaderObject_Class };