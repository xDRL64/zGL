"use strict";

var get_zedGL_shaderUsing_examples = function(zgl, uniformInfoMaker, Obj3Dproto, geometry, texture){
	
	// 3D matos
	var gl = zgl.gl;
	var math = zgl.Math;

	var projectionMatrix = math.ColMat_proj(90, zgl.domElem.width/zgl.domElem.height, 0.001, 1000);

	var camera = new Obj3Dproto();
	camera.viewMatrix = camera.make_viewMatrix();

	function create_light(pos, col, dis, dec){ this.pos=pos; this.col=col; this.dis=dis; this.dec=dec; }
	var pointLights = [
		new create_light( new Float32Array([1,2,3]), new Float32Array([.004,.05,.6]), 7, 8 ),
		new create_light( new Float32Array([1,2,3]), new Float32Array([.004,.05,.6]), 7, 8 )
	];

	var scene = {
		lights : {
			points : pointLights
		}
	}

	// ShaderObject Instance :
	var shaderCode = zGLSL.fakeAll_2lights;
	var attributeInfo = { _v:3, _c:3, _u:2, _n:3 };
	var complexUniformInfo = [ {pos:'vec3',col:'vec3',dis:'float',dec:'float'}, 2 ];
	var allUniformInfo = {_M:'mat4', _V:'mat4', _P:'mat4', _MV:'mat4', _MVP:'mat4', _t:'sampler2D', _pl:complexUniformInfo};
	var uniformInfo = uniformInfoMaker.parse( allUniformInfo ).output;
	var shaderObj = new zgl.ShaderObject( shaderCode, attributeInfo, uniformInfo );

	// Obj3Dproto Instance :
	var obj3D = new Obj3Dproto();
	window.obj3D = obj3D;

	var resources = {};
	obj3D.shadersResources = resources; // default : obj3D.shadersResources = obj3D
	obj3D.shadersResourcesRef = obj3D.shadersResources;


	resources.v = geometry.v;
	resources.c = geometry.c;
	resources.u = geometry.u;
	resources.n = geometry.n;
	
	resources.t = texture;
	resources.P = projectionMatrix;
	Object.defineProperty(resources, 'M', { get:function(){
		obj3D.update_modelMatrix();
		return obj3D.modelMatrix;
	} });
	Object.defineProperty(resources, 'V', { get:function(){
		return camera.viewMatrix
	} });
	Object.defineProperty(resources, 'MV', { get:function(){
		return math.mul_CM(this.V, this.M);
	} });
	Object.defineProperty(resources, 'MVP', { get:function(){
		return math.mul_CM(this.P, this.MV);
	} });
	resources.scene = scene;

	obj3D.scene = scene;

	return {

		// hard code
		onlyShaderObject : {
			init : function(){
				
			},
			draw : function(xRot, yRot, zRot){
				shaderObj.attributes._v.data = geometry.v;
				shaderObj.attributes._c.data = geometry.c;
				shaderObj.attributes._u.data = geometry.u;
				shaderObj.attributes._n.data = geometry.n;
	
				var yxRotMat = math.mul_CM( math.makeRotationY(yRot), math.makeRotationX(xRot) );
				var m = math.mul_CM( math.make_translation(-20,20,-30), yxRotMat );
				var v = camera.viewMatrix;
				var p = projectionMatrix;
				var mv = math.mul_CM(v, m);
				var mvp = math.mul_CM(p, mv);
	
				shaderObj.uniforms._M.data = m;
				shaderObj.uniforms._V.data = v;
				shaderObj.uniforms._P.data = p;
				shaderObj.uniforms._MV.data = mv;
				shaderObj.uniforms._MVP.data = mvp;
	
				shaderObj.uniforms['_pl[0].pos'].data = pointLights[0].pos;
				shaderObj.uniforms['_pl[0].col'].data = pointLights[0].col;
				shaderObj.uniforms['_pl[0].dis'].data = pointLights[0].dis;
				shaderObj.uniforms['_pl[0].dec'].data = pointLights[0].dec;
				shaderObj.uniforms['_pl[1].pos'].data = pointLights[1].pos;
				shaderObj.uniforms['_pl[1].col'].data = pointLights[1].col;
				shaderObj.uniforms['_pl[1].dis'].data = pointLights[1].dis;
				shaderObj.uniforms['_pl[1].dec'].data = pointLights[1].dec;
	
				shaderObj.start();
	
				gl.drawArrays(gl.TRIANGLES, 0, 12096);
			},
		},
		
		// obj3D add/update
		obj3D_use_shaderObject : {
			init : function(){
				this.shaderIndex = obj3D.shaders.length;
				obj3D.add_shader(shaderObj,
					{
						_v           : 'v',
						_c           : 'c',
						_u           : 'u',
						_n           : 'n',
						_t           : 't',
						_M           : 'M',
						_V           : 'V',
						_P           : 'P',
						_MV          : 'MV',
						_MVP         : 'MVP',
						'_pl[0].pos' : 'scene.lights.points[0].pos',
						'_pl[0].col' : 'scene.lights.points[0].col',
						'_pl[0].dis' : 'scene.lights.points[0].dis',
						'_pl[0].dec' : 'scene.lights.points[0].dec',
						'_pl[1].pos' : 'scene.lights.points[1].pos',
						'_pl[1].col' : 'scene.lights.points[1].col',
						'_pl[1].dis' : 'scene.lights.points[1].dis',
						'_pl[1].dec' : 'scene.lights.points[1].dec',
					}
				);
			},
			draw : function(xRot, yRot, zRot){
				obj3D.pos = {x:20,y:20,z:-30};
				obj3D.rot.x = xRot;
				obj3D.rot.y = yRot;
				obj3D.update_shaderData(this.shaderIndex);
				gl.drawArrays(gl.TRIANGLES, 0, 12096);
			},
		},

		// obj3D smartAdd/update
		obj3D_smartUse_shaderObject : {
			init : function(){
				this.shaderIndex = obj3D.shaders.length;
				obj3D.smartAdd_shader(shaderObj,
					{
						_v:'v', _c:'c', _u:'u', _n:'n',
						_t:'t', _M:'M', _V:'V', _P:'P', _MV:'MV', _MVP:'MVP',
						'_pl[]':'scene.lights.points'
					}
				);
			},
			draw : function(xRot, yRot, zRot){
				obj3D.pos = {x:-20,y:-20,z:-30};
				obj3D.rot.x = xRot;
				obj3D.rot.y = yRot;
				obj3D.update_shaderData(this.shaderIndex);
				gl.drawArrays(gl.TRIANGLES, 0, 12096);
			},
		},

		// obj3D optiSmartAdd/update
		obj3D_optiSmartUse_shaderObject : {
			init : function(){
				this.shaderIndex = obj3D.shaders.length;
				obj3D.set_shader(shaderObj,
					{ _v:'v', _c:'c', _u:'u', _n:'n' },
					{ _t:'t', _M:'M', _V:'V', _P:'P', _MV:'MV', _MVP:'MVP', '_pl[]':'scene.lights.points' }
				);
			},
			draw : function(xRot, yRot, zRot){
				obj3D.pos = {x:20,y:-20,z:-30};
				obj3D.rot.x = xRot;
				obj3D.rot.y = yRot;
				obj3D.start_shader(this.shaderIndex);
				gl.drawArrays(gl.TRIANGLES, 0, 12096);
			},
		},

	};

};

