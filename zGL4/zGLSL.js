var zGLSL = {};

zGLSL.texture = function(data){
    return {
        vertex : `
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;
        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        varying vec3 xyz;
        varying highp vec2 vTextureCoord;
        void main(void) {
            vec4 XYZ = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
            xyz = vec3(XYZ[0], XYZ[1], XYZ[2]);
            vTextureCoord = aTextureCoord;
            gl_Position = XYZ;
        }
        `,
        fragment : `
        precision mediump float;
        varying vec3 xyz;
        varying highp vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float oneFloat;
        void main(void){
            
            vec4 finalColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));
            gl_FragColor = finalColor * oneFloat;
            //gl_FragColor = vec4(1,1,1,1);
            //gl_FragColor = vec4(xyz[0]+finalColor[0], xyz[1]+finalColor[1], (xyz[0]*xyz[1])+finalColor[2], 1.);
            //gl_FragColor = vec4(xyz[0], xyz[1], (xyz[0]*xyz[1]), 1.);
            //gl_FragColor = vec4(vTextureCoord.x, vTextureCoord.y, 0, 1.);
        }
        `};
};



zGLSL.texSmoothLighting = function(data){
    return {
        vertex : `
        attribute vec3 aVertexPosition;
        attribute vec3 aNormalDirection;
        attribute vec2 aTextureCoord;
        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        varying vec3 xyz;
        varying vec3 norm;
        varying highp vec2 vTextureCoord;
        void main(void) {
            vec4 XYZ = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
            //xyz = vec3(XYZ[0], XYZ[1], XYZ[2]);
            xyz = aVertexPosition.xyz;
            norm = aNormalDirection;
            vTextureCoord = aTextureCoord;
            gl_Position = XYZ;
        }
        `,
        fragment : `
        precision mediump float;
        varying vec3 xyz;
        varying vec3 norm;
        varying highp vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float oneFloat;
        void main(void){
            //vec3 L = normalize(vec3(-5,0,1));
            vec3 Lpos = vec3(5,0,-1);
            vec3 L = normalize(xyz - Lpos);
            vec3 N = norm;
            float dLN = (dot(N,L));
            vec4 finalColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));
            //vec3 f = finalColor.rgb*dLN;
            gl_FragColor = vec4(dLN,dLN,dLN,1);
            //gl_FragColor = vec4(finalColor.rgb*dLN, 1.);

            //gl_FragColor = vec4(norm.x,norm.y,norm.z,1);
            //gl_FragColor = vec4(xyz[0]+finalColor[0], xyz[1]+finalColor[1], (xyz[0]*xyz[1])+finalColor[2], 1.);
            //gl_FragColor = vec4(xyz[0], xyz[1], (xyz[0]*xyz[1]), 1.);
            //gl_FragColor = vec4(vTextureCoord.x, vTextureCoord.y, 0, 1.);
        }
        `};
};

zGLSL.colTexSmoothLighting = function(data){
    return {
        vertex : `
        attribute vec3 aVertexPosition;
        attribute vec3 aVertexColor;
        attribute vec3 aNormalDirection;
        attribute vec2 aTextureCoord;
        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        uniform float time;
        varying vec3 xyz;
        varying vec4 col;
        varying vec3 norm;
        varying highp vec2 vTextureCoord;
        void main(void) {
			vec3 v = aVertexPosition;
			float moveFact = sin(2.0 * v.y + time) * 0.5;
			v.x += moveFact;
			v.z += moveFact;
            vec4 XYZ = uPMatrix * uMVMatrix * vec4(v, 1.0);
            //xyz = vec3(XYZ[0], XYZ[1], XYZ[2]);
			xyz = aVertexPosition.xyz;
			col = vec4(aVertexColor,1);
            norm = aNormalDirection;
            vTextureCoord = aTextureCoord;
            gl_Position = XYZ;
        }
        `,
        fragment : `
        precision mediump float;
		varying vec3 xyz;
		varying vec4 col;
        varying vec3 norm;
        varying highp vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float oneFloat;
        void main(void){
            //vec3 L = normalize(vec3(-5,0,1));
            vec3 Lpos = vec3(5,0,-1);
            vec3 L = normalize(xyz - Lpos);
            vec3 N = norm;
            float dLN = (dot(N,L));
            vec4 finalColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));
            //vec3 f = finalColor.rgb*dLN;
            gl_FragColor = vec4( (finalColor.rgb/vec3(1) + (col.rgb/vec3(16)))  * dLN, 1);
            //gl_FragColor = vec4(dLN,dLN,dLN,1);
            //gl_FragColor = vec4(finalColor.rgb*dLN, 1.);

            //gl_FragColor = vec4(norm.x,norm.y,norm.z,1);
            //gl_FragColor = vec4(xyz[0]+finalColor[0], xyz[1]+finalColor[1], (xyz[0]*xyz[1])+finalColor[2], 1.);
            //gl_FragColor = vec4(xyz[0], xyz[1], (xyz[0]*xyz[1]), 1.);
            //gl_FragColor = vec4(vTextureCoord.x, vTextureCoord.y, 0, 1.);
        }
        `};
};

zGLSL.texGouraud = function(data){
    return {
        vertex : `
        attribute vec3 aVertexPosition;
        attribute vec3 aNormalDirection;
        attribute vec2 aTextureCoord;
        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        varying vec3 xyz;
        varying vec3 norm;
        varying vec3 gour;
        varying highp vec2 vTextureCoord;
        void main(void) {
            vec3 L = normalize(vec3(-5,0,1));
            vec3 N = normalize(aNormalDirection);
            float dLN = (dot(N,L));
            gour = vec3(dLN);
            vec4 XYZ = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
            xyz = vec3(XYZ[0], XYZ[1], XYZ[2]);
            norm = aNormalDirection;
            vTextureCoord = aTextureCoord;
            gl_Position = XYZ;
        }
        `,
        fragment : `
        precision mediump float;
        varying vec3 xyz;
        varying vec3 norm;
        varying highp vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float oneFloat;
        varying vec3 gour;
        void main(void){

            vec4 finalColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));
            //vec3 f = finalColor.rgb*dLN;
            //gl_FragColor = vec4(dLN,dLN,dLN,1);

            //gl_FragColor = vec4(finalColor.rgb*dLN, 1.);
            gl_FragColor = vec4(gour, 1.);

        }
        `};
};




zGLSL.all = {

	vertex : `
		#define vCOLOR true
		#define RGB true
		#define RGBA true


		precision highp float;

		attribute vec3 _v;
		#ifdef RGBA
			attribute vec3 _c;
		attribute vec4 _c;
		attribute vec3 _u;
		attribute vec3 _n;

		uniform mat4 _mvp;
		uniform mat4 _mv;
		uniform mat4 _m;

		uniform vec3  _pl0;
		uniform float _pl0int;
		uniform float _pl0dis;
		uniform vec3  _pl0col;

		varying vec3 _v_;
		varying vec4 _c_;
		varying vec2 _u_;
		varying vec3 _n_;

		void main(void){

			vec3 rgb  = _c;
			vec4 rgba = _c;

			_v_ = vec4(_v, 1.);
			_c_ = color;
			_n_ = vec4(_n, 0.);

			gl_Position = _mvp * vec4(_v, 1.);
		}
	`,

	fragment : `
		precision highp float;
		
		uniform mat4 _mvp;
		uniform mat4 _mv;
		uniform mat4 _m;

		varying vec3 _v_;
		varying vec3 _c_;
		varying vec3 _u_;
		varying vec3 _n_;

		void main(void){
			gl_FragColor = vec4(color.rgb, color.a);
		}
	`,
};

zGLSL.litStructTest = {

	vertex : `
		precision highp float;
		attribute vec3 _v;
		uniform mat4 _mvp;
		struct pL {
			vec3 pos;
			vec3 col;
			float dis;
			float dec;
		};
		uniform pL _pl[2];
		void main(void){
			float ppp = _pl[0].col.r * _pl[1].col.r * 0. + 1.;
			gl_Position = _mvp * vec4(_v, ppp);
		}
	`
	,

	fragment : `
		precision highp float;
		void main(void){
			vec4 color = vec4(1);
			gl_FragColor = vec4(1., 0., 0., color.a);
		}
	`,
};