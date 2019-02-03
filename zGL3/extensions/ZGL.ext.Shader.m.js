"use strict";

function zGL_Shader_ext (zgl){

	var standardOrder = ['color', 'texture', 'lighting', 'specular'];

	// 0 -> color    : true, false
	// 1 -> texture  : 'uv', 'env'
	// 2 -> lighting : 'gouraud', 'phong', 'cellshading'
	// 3 -> specular : 'gouraud', 'phong', 'cellshading'
	this.generate_standard = function(o={color, texture, lighting, specular}){
		debugger
		// make properties order
		var props = [
			o.color,
			o.texture,
			o.lighting,
			o.specular
		];
		
		var vs_precision  = 'precision highp float;';
		var vs_attributes = 'attribute vec3 _v;';
		var vs_uniforms   = 'uniform mat4 _m;';
		var vs_varying    = '';
		var vs_out        = 'gl_Position = _m * vec4(_v, 1.0);';
			   
		var fs_precision  = 'precision highp float;';
		var fs_uniforms   = 'uniform mat4 _m;';
		var fs_varying    = '';
		var fs_color      = '('; 
		var fs_out        = 'gl_FragColor = vec4(';


		if(o.color){
			vs_attributes += 'attribute vec3 _c;';
			vs_varying    += 'varying vec3 _c_;';
			vs_out        += '_c_ = _c;';

			fs_varying    += 'varying vec3 _c_;';
			fs_color      += ' _c_ ';
		}

		if(o.texture){
			vs_attributes += 'attribute vec3 _u;';
			vs_varying    += 'varying vec3 _u_;';
			vs_out        += '_u_ = _u;';
			
			vs_uniforms   += 'uniform sampler2D _t;';
			fs_varying    += 'varying vec3 _u_;';
			fs_color      += fs_color.length? ' * ' : ''
			               + ' texture2D(_t, _u_) ';
		}

		fs_color += ')';

		//fs_out   += fs_color + '.rgb' ' * ndl + vec3(specComp), 1.);'

		var vs = vs_precision
		       + vs_attributes
		       + vs_uniforms
		       + vs_varying
		       + 'void main(void){'
			   + vs_out
			   + '}';

		var fs = fs_precision
		       + fs_uniforms
		       + fs_varying
		       + 'void main(void){'
			   + fs_out
			   + '}';
		
		debugger
	};

}

var _ext = new zGL_Shader_ext();
export { _ext as Shader };
