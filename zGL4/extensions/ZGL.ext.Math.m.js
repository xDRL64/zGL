"use strict";

function zGL_Math_ext (zgl){
	
	this.degToRad = function(angle){
		return (angle*Math.PI)/180;
	};
	
	this.mat_id = function () {
		var ang = 1.9;
		var sin = Math.sin(ang);
		var cos = Math.cos(ang);
		return [ .6,   -.3,   .6,  0,
				  0,    .8,   .4,  0,
				-.7,   -.3,   .6,  0,
				  0,     0,   -40,  1
		];
	};
	
	/*
	this.mat_id = function () {
		var ang = 1.0;
		var sin = Math.sin(ang);
		var cos = Math.cos(ang);
		return [ cos,    0,   sin,   0,
				  0,     1,     0,   0,
				-sin,    0,   cos,   0,
				  0,     0,   -40,   1
		];
	};
	*/
	
	
	this.mat_id = function () {
		return [ 1,    0,    0,   0,
				 0,    1,    0,   0,
				 0,    0,    1,   0,
				 0,    0,    1,   1
		];
	};
	
	this.mat_trans40z = function () {
		return [ 1,    0,    0,   0,
				 0,    1,    0,   0,
				 0,    0,    1,   0,
				 0,    0,  -40,   1
		];
	};
	this.mat_trans = function (x,y,z) {
		return [ 1,    0,    0,   0,
				 0,    1,    0,   0,
				 0,    0,    1,   0,
				 x,    y,    z,   1
		];
	};


	this.makeRotationX = function( theta ) {
		var c = Math.cos( theta ), s = Math.sin( theta );
		return [
			1, 0,  0, 0,
			0, c, -s, 0,
			0, s,  c, 0,
			0, 0,  0, 1
		];
	}
	this.makeRotationY = function( theta ) {
		var c = Math.cos( theta ), s = Math.sin( theta );
		return [
			c, 0, -s, 0,
			0, 1,  0, 0,
			s, 0,  c, 0,
			0, 0,  0, 1
		];
	}
	
	this.ColMat_proj = function (fov, aspect, near, far)
	{
		var rad = this.degToRad(fov*0.5);
		var tan = Math.tan(rad);
		var A = -(far+near)/(far-near);
		var B = (-2*far*near)/(far-near);
		return [
			0.5/tan,	0.0,				0.0,	0.0,
			0.0,		(0.5*aspect)/tan,	0.0,	0.0,
			0.0,		0.0,				A,		-1,
			0.0,		0.0,				B,		0.0
		];
	};

	this.mul_CM = function( a, b ) {

		var ae = a;
		var be = b;
		var te = [];

		var a11 = ae[0], a12 = ae[4], a13 = ae[ 8], a14 = ae[12];
		var a21 = ae[1], a22 = ae[5], a23 = ae[ 9], a24 = ae[13];
		var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
		var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

		var b11 = be[ 0], b12 = be[ 4], b13 = be[ 8], b14 = be[12];
		var b21 = be[ 1], b22 = be[ 5], b23 = be[ 9], b24 = be[13];
		var b31 = be[ 2], b32 = be[ 6], b33 = be[10], b34 = be[14];
		var b41 = be[ 3], b42 = be[ 7], b43 = be[11], b44 = be[15];

		te[ 0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return te;
	}

};

var _ext = new zGL_Math_ext();
export { _ext as Math };

