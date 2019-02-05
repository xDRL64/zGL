"use strict";

function zGL_Shader_ext (zgl){

	var standardOrder = ['color', 'texture', 'lighting', 'specular'];

	// color    : true, false
	// texture  : 'uv', 'env'
	// lighting : 'gouraud', 'phong', 'cellshading'
	// specular : 'gouraud', 'phong', 'cellshading'
	this.generate_standard = function(o={color, texture, lighting, specular}){
		

		var vs_precision  = 'precision highp float;';
		var vs_attributes = 'attribute vec3 _v;';
		var vs_uniforms   = 'uniform mat4 _m;';
		var vs_varying    = '';
		var vs_out        = 'gl_Position = _m * vec4(_v, 1.0);';
			   
		var fs_precision  = 'precision highp float;';
		var fs_uniforms   = '';
		var fs_varying    = '';
		var fs_color      = ''; 
		var fs_out        = 'gl_FragColor = vec4(';


		if(o.color){
			vs_attributes += 'attribute vec4 _c;';
			vs_varying    += 'varying vec4 _c_;';
			vs_out        += '_c_ = _c;';

			fs_varying    += 'varying vec4 _c_;';
			fs_color      += '_c_';
		}

		if(o.texture === 'uv'){
			vs_attributes += 'attribute vec2 _u;';
			vs_varying    += 'varying vec2 _u_;';
			vs_out        += '_u_ = _u;';
			
			fs_uniforms   += 'uniform sampler2D _t;';
			fs_varying    += 'varying vec2 _u_;';
			fs_color      += (fs_color.length?'*':'')+'texture2D(_t, _u_)';
		}

		if(!o.color && !o.texture)
			fs_color       = 'vec4(1)';

		

		var vs = (
			vs_precision
			+ vs_attributes
			+ vs_uniforms
			+ vs_varying
			+ 'void main(void){'
			+ vs_out
			+ '}'
		);

		var fs = (
			fs_precision
			+ fs_uniforms
			+ fs_varying
			+ 'void main(void){'
			+ 'vec4 color = '+fs_color+';'
			+ fs_out+'color.rgb'+(o.lighting?'*lambert':'')+(o.specular?'+spec':'')+',color.a);'
			+ '}'
		);
		
		return {
			vertex   : vs,
			fragment : fs,
			debug : function(){
				var v = this.vertex.replace(/;/g, ';\n').replace(/{/g, '{\n').replace(/}/g, '}\n');
				var f = this.fragment.replace(/;/g, ';\n').replace(/{/g, '{\n').replace(/}/g, '}\n');
				console.log(v,f);
			}
		}
	};

}

var _ext = new zGL_Shader_ext();
export { _ext as Shader };
