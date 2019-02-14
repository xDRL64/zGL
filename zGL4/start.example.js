var canvasElem = document.getElementById('viewport');

zgl = new zGL(canvasElem);
zgl2 = new zGL(canvasElem);

zgl.Loader.addToLoading("myFbx", "any", "teapot.fbx");
zgl.Loader.addToLoading("myImage","img","./TEX64.png");
















var afterLoading = function(){




	function Obj3Dproto(){
		this.pos = {x:0, y:0, z:0};
		this.rot = {x:0, y:0, z:0};
		this.sca = {x:1, y:1, z:1};
	
		this.modelMatrix = null;
	
		this.material = new ShaderMaterialProto(this);
	
		this.shaderData = {};
	}
	Obj3Dproto.prototype.update_modelMatrix = function(){
		var posMat = math.make_translation(this.pos.x, this.pos.y, this.pos.z);
		var rotMat = math.make_rotation(this.rot.x, this.rot.y, this.rot.z);
		var scaMat = math.make_scale(this.sca.x, this.sca.y, this.sca.z);
		this.modelMatrix = math.mul_CM( posMat, math.mul_CM(scaMat, rotMat) );
	};
	Obj3Dproto.prototype.make_viewMatrix = function(){
		var posMat = math.make_translation(-this.pos.x, -this.pos.y, -this.pos.z);
		var rotMat = math.make_rotation(-this.rot.x, -this.rot.y, -this.rot.z);
		return math.mul_CM(posMat, rotMat);
	};
	
	
	
	
	function ShaderMaterialProto(Obj3Dproto){
		this.obj3D = Obj3Dproto;
	
		this.shader = null;
		this.shaderBoundRefs = [];
	
	}
	ShaderMaterialProto.prototype.bind_refs = function(shaderRefName, obj3DrefName){
		this.shaderBoundRefs.push(
			{
				shaderSide : shaderRefName,
				obj3Dside  : obj3DrefName
			}
		);
	};







	gl.clearColor(.1,.1,.1,1);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);


	if(localStorage.getItem('saved_triangles')===null){
		
		var fbxObj = zgl.FBX.parse(zgl.Loader.data.myFbx);
		console.log(fbxObj);
	
		var directMesh34 = zgl.FBX.import(fbxObj, 'Utah_Teapot_Quads');
		console.log(directMesh34);
		
		var directMesh3 = zgl.Geometry.triangulate_zglDirectMesh34(directMesh34);
		console.log(directMesh3);

		localStorage.setItem( 'saved_triangles', JSON.stringify(directMesh3) );
	}else{
		var directMesh3 = JSON.parse( localStorage.getItem('saved_triangles') );
	}

	// ATTRIBUTES DATA
	var vBuffer = zgl.buffer_f32A(directMesh3.v);
	var nBuffer = zgl.buffer_f32A(directMesh3.n);
	var uBuffer = zgl.buffer_f32A(directMesh3.u);
	
	var cBuffer = zgl.buffer_f32A(directMesh3.v);

	var texture = zgl.tex_2D(Loader.data.myImage, zgl.texSettings({mipmap:false}));

	var projectionMatrix = math.ColMat_proj(90, zgl2.domElem.width/zgl2.domElem.height, 0.001, 1000);

	// ATTRIBUTES DATA
	//var vBuffer = zgl.buffer_f32A(vData);
	//var nBuffer = zgl.buffer_f32A(nData);
	//var uBuffer = zgl.buffer_f32A(uData);
	//var tBuffer = zgl.buffer_ui16A(tData);
	//
	//var cData = vData;
	//var cBuffer = zgl.buffer_f32A(cData);
	


/* 
	// SWITCHING SHADER TEST
	var shaderCodes = zgl.Shader.generate_standard({color:true, texture:'uv'});
	window.shaderObj = new zgl.ShaderObject(shaderCodes, {_v:3, _c:3, _u:2}, {_mvp:'mat4', _t:'sampler2D'});
		shaderObj.attributes._v.data = vBuffer;
		shaderObj.attributes._c.data = cBuffer;
		shaderObj.attributes._u.data = uBuffer;
		shaderObj.uniforms._mvp.data = math.ColMat_proj(90, zgl.domElem.width/zgl.domElem.height, 0.001, 1000);
		shaderObj.uniforms._t.data = zgl.tex_2D(Loader.data.myImage, zgl.texSettings({mipmap:false}));
	shaderObj.start();
 */


/* 
	var shaderCodes2 = zgl2.Shader.generate_standard({texture:'xy'});
	shaderCodes2.debug();
	window.shaderObj2 = new zgl2.ShaderObject(shaderCodes2, {_v:3}, {_mvp:'mat4', _t:'sampler2D'});
		shaderObj2.attributes._v.data = vBuffer;
		shaderObj2.uniforms._t.data = zgl.tex_2D(Loader.data.myImage, zgl.texSettings({mipmap:false}));
		shaderObj2.uniforms._mvp.data = math.ColMat_proj(90, zgl2.domElem.width/zgl2.domElem.height, 0.001, 1000);
	shaderObj2.start();
 */




	var shaderCodes2 = zgl2.Shader.generate_standard({texture:'env'});
	shaderCodes2.debug();
	window.shaderObj2 = new zgl2.ShaderObject(shaderCodes2, {_v:3, _n:3}, {_mvp:'mat4', _mv:'mat4', _t:'sampler2D'});
		shaderObj2.attributes._v.data = vBuffer;
		shaderObj2.attributes._n.data = nBuffer;
		shaderObj2.uniforms._t.data = texture;
		shaderObj2.uniforms._mvp.data = projectionMatrix;
		shaderObj2.uniforms._mv.data = math.mat_id();
	shaderObj2.start();


	var envTeaPot = new Obj3Dproto();

	envTeaPot.material.shader = shaderObj2;
	envTeaPot.shaderData.vertices = vBuffer;
	envTeaPot.shaderData.colors   = cBuffer;
	envTeaPot.shaderData.uvs      = uBuffer;
	envTeaPot.shaderData.normals  = nBuffer;
	envTeaPot.shaderData.texture  = texture;
	envTeaPot.shaderData.pMat     = projectionMatrix;
	Object.defineProperty(envTeaPot.shaderData, 'vMat', { get:function(){
		return camera.viewMatrix
	} });
	Object.defineProperty(envTeaPot.shaderData, 'mvMat', { get:function(){
		envTeaPot.update_modelMatrix();
		return math.mul_CM(this.vMat, envTeaPot.modelMatrix);
	} });
	Object.defineProperty(envTeaPot.shaderData, 'mvpMat', { get:function(){
		return math.mul_CM(this.pMat, this.mvMat);
	} });
	
	//envTeaPot.material.bind_refs({_v:'vertices', _n:'normals', _mvp:'mvpMat', _mv:'mvMat', _t:'texture'})
	envTeaPot.material.bind_refs('_v',   'vertices');
	envTeaPot.material.bind_refs('_n',   'normals');
	envTeaPot.material.bind_refs('_mvp', 'mvpMat');
	envTeaPot.material.bind_refs('_mv',  'mvMat');
	envTeaPot.material.bind_refs('_t',  'texture');

	window.envTeaPot = envTeaPot;



	var camera = new Obj3Dproto();
	camera.viewMatrix = camera.make_viewMatrix();

	window.camZpos.set.exec = function(val){
		camera.pos.z = val;
		camera.viewMatrix = camera.make_viewMatrix();
	};
	window.camera = camera;


	
	var xRot = 0;
	var yRot = 0;
	var startTime = Date.now();
	var loop = function(){
		requestAnimationFrame(loop);
		gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
		
		//timePair.data =( Date.now() - startTime) / 100;
		let yxRotMat = math.mul_CM( math.makeRotationY(yRot), math.makeRotationX(xRot) );
		let viewMat = camera.viewMatrix;
		let projMat = math.ColMat_proj(90, zgl.domElem.width/zgl.domElem.height, 0.001, 1000);
		xRot += 0.005;
		yRot += 0.005;
		



		let modelMatrix;
		let mv;
		let mvp;
/* 
		modelMatrix = math.mul_CM( math.make_translation(20,0,-50), yxRotMat );
		mvp = math.mul_CM(projMat, modelMatrix);
		shaderObj.uniforms._mvp.data = mvp;

		shaderObj.start();
		gl.drawArrays(gl.TRIANGLES, 0, 12096);
 */

/* 
		modelMatrix = math.mul_CM( math.make_translation(-20,0,-30), yxRotMat );
		mvp = math.mul_CM(projMat, modelMatrix);
		shaderObj2.uniforms._mvp.data = mvp;

		shaderObj2.start();
		gl.drawArrays(gl.TRIANGLES, 0, 12096);
 */

		modelMatrix = math.mul_CM( math.make_translation(-20,0,-30), yxRotMat );
		mv = math.mul_CM(viewMat, modelMatrix);
		mvp = math.mul_CM(projMat, mv);
		shaderObj2.uniforms._mvp.data = mvp;
		shaderObj2.uniforms._mv.data = mv;

		shaderObj2.start();
		gl.drawArrays(gl.TRIANGLES, 0, 12096);


		//zgl.draw_triangles(tBuffer);
		//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		//gl.drawArrays(gl.TRIANGLES, 0, 12096);
	};

	loop();

};


var afterLoadingScope = {
	gl : zgl.gl,
	math : zgl.Math,
	Loader : zgl.Loader,
};
zgl.Loader.callback = FuncScopeRedefiner.set(afterLoading, afterLoadingScope).get_result();;
zgl.Loader.load();



/* var test_perfs = function(func, loopCount){
	console.time();
	for(let i=0; i<loopCount; i++)
		func();
	console.timeEnd();
};

var _eval = zgl.vbo99;
var noeva = zgl.clear_viewport;

test_perfs(_eval, 100000);
test_perfs(noeva, 100000);
console.log(' - - - ');

test_perfs(_eval, 100000);
test_perfs(noeva, 100000);
console.log(' - - - ');

test_perfs(_eval, 100000);
test_perfs(noeva, 100000);
console.log(' - - - ');

test_perfs(_eval, 100000);
test_perfs(noeva, 100000);
console.log(' - - - ');

test_perfs(_eval, 100000);
test_perfs(noeva, 100000);
console.log(' - - - ');

test_perfs(_eval, 100000);
test_perfs(noeva, 100000);
console.log(' - - - ');
 */
