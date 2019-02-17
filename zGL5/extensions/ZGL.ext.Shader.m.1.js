"use strict";

function zGL_Shader_ext (zgl){



	// color        : true, false
	// texture      : 'uv', 'env'
	// lights       : number
	// ambiants     : number
	// directionals : number
	// hemispheres  : number
	// lighting     : 'gouraud', 'phong', 'cellshading'
	// specular     : 'gouraud', 'phong', 'cellshading'
	this.generate_standard = function(o={color, texture, lights, ambiants, directionals, hemispheres, lighting, specular}){
		

		var vs_precision  = 'precision highp float;';
		var vs_attributes = 'attribute vec3 _v;';
		var vs_uniforms   = 'uniform mat4 _mvp;';
		var vs_varying    = '';
		var vs_out        = 'gl_Position = _mvp * vec4(_v, 1.0);';
			   
		var fs_precision  = 'precision highp float;';
		var fs_uniforms   = '';
		var fs_varying    = '';
		var fs_body       = '';
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

		// xx, xy, xz,  yy, yx, yz,  zz, zx, zy
		// (should need : a wrapped XY texture)
		if(o.texture.match( /^[xyz][xyz]$/g )){
			vs_varying    += 'varying vec3 _u_;';
			vs_out        += '_u_ = _v;';
			
			fs_uniforms   += 'uniform sampler2D _t;';
			fs_varying    += 'varying vec3 _u_;';

			fs_color      += (fs_color.length?'*':'')+'texture2D(_t, _u_.'+o.texture+')';
		}

		if(!o.color && !o.texture){
			fs_color       = 'vec4(1)';
		}

		if(o.texture === 'env' || o.lighting || o.specular){
			vs_attributes += 'attribute vec3 _n;';
		}

		if(o.texture === 'env'){
			vs_varying    += 'varying vec4 _v_;';
			vs_varying    += 'varying vec4 _n_;';
			vs_out        += '_v_ = vec4(_v, 1.);';
			vs_out        += '_n_ = vec4(_n, 0.);';
			
			fs_uniforms   += 'uniform mat4 _mv;';
			fs_uniforms   += 'uniform sampler2D _t;';
			fs_varying    += 'varying vec4 _v_;';
			fs_varying    += 'varying vec4 _n_;';

			fs_body        = 'vec3 r = reflect( normalize((_mv*_v_).xyz), normalize((_mv*_n_).xyz) );'
			               + 'vec2 uv = r.xy / (2. * sqrt(pow(r.x, 2.)+pow(r.y, 2.)+pow(r.z+1., 2.))) + .5;';

			fs_color      += (fs_color.length?'*':'')+'texture2D(_t, uv)';
		}


		if(o.lighting === 'gouraud'){

			if(o.lights){
				let uniforms = '';
				for(let i=0; i<o.lights.length; i++){
					uniforms += 'uniform vec3 _pl'+i+';';
					uniforms += 'uniform float _pl'+i+'int;';
					uniforms += 'uniform float _pl'+i+'dir;';
					uniforms += 'uniform vec3 _pl'+i+'col;';
				}
				if(o.lighting === 'gouraud')
					vs_uniforms += uniforms;
				else if(o.lighting === 'phong')
					fs_uniforms += uniforms;
			}

		}


		


		

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
			+ fs_body
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
