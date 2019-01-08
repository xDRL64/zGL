var ZGL_ext_Math = function(zgl){
	
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
		var ang = 1.5;
		var sin = Math.sin(ang);
		var cos = Math.cos(ang);
		return [ 1,    0,    .0,   0,
				 0,    1,    0,   0,
				 0,    0,    1,   0,
				 0,    0,   -27,  1
		];
	};
	
	
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
	}

};




