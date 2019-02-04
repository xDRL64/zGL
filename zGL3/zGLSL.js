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
        varying vec3 xyz;
        varying vec4 col;
        varying vec3 norm;
        varying highp vec2 vTextureCoord;
        void main(void) {
            vec4 XYZ = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
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




