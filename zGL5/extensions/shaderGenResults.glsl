// nothing
precision highp float;
attribute vec3 _v;
uniform mat4 _m;
void main(void){
	gl_Position = _m * vec4(_v, 1.0);
}

precision highp float;
uniform mat4 _m;
void main(void){
	vec4 color = vec4(1);
	gl_FragColor = vec4(color.rgb,color.a);
}











// color
precision highp float;
attribute vec3 _v;
attribute vec3 _c;
uniform mat4 _m;
varying vec3 _c_;
void main(void){
	gl_Position = _m * vec4(_v, 1.0);
	_c_ = _c;
}

precision highp float;
uniform mat4 _m;
varying vec3 _c_;
void main(void){
	vec4 color = _c_;
	gl_FragColor = vec4(color.rgb,color.a);
}












// texture
precision highp float;
attribute vec3 _v;
attribute vec3 _u;
uniform mat4 _m;
varying vec3 _u_;
void main(void){
	gl_Position = _m * vec4(_v, 1.0);
	_u_ = _u;
}

precision highp float;
uniform mat4 _m;
uniform sampler2D _t;
varying vec3 _u_;
void main(void){
	vec4 color = texture2D(_t, _u_);
	gl_FragColor = vec4(color.rgb,color.a);
}










// color + texture
precision highp float;
attribute vec3 _v;
attribute vec3 _c;
attribute vec3 _u;
uniform mat4 _m;
varying vec3 _c_;
varying vec3 _u_;
void main(void){
	gl_Position = _m * vec4(_v, 1.0);
	_c_ = _c;
	_u_ = _u;
}

precision highp float;
uniform mat4 _m;
uniform sampler2D _t;
varying vec3 _c_;
varying vec3 _u_;
void main(void){
	vec4 color = _c_*texture2D(_t, _u_);
	gl_FragColor = vec4(color.rgb,color.a);
}