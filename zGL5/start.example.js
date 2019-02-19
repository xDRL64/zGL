"use strict";

var canvasElem = document.getElementById('viewport');

var zgl = new zGL(canvasElem);
var zgl2 = new zGL(canvasElem);

zgl.Loader.addToLoading("myFbx", "any", "teapot.fbx");
zgl.Loader.addToLoading("myImage","img","./TEX64.png");




function deepClone_object(object){
	return JSON.parse( JSON.stringify(object) );
}



var uniformsParser = (function(){

	var output = null;
	var objectPropsToOutputIndexes_tableObject = null;

	var pathChain = null;
	var indexChain = null;
	var type = '';

	return {
	
		parse : function(uniformsObj){
			output = [];
			objectPropsToOutputIndexes_tableObject = JSON.parse( JSON.stringify(uniformsObj) );

			pathChain = [];
			indexChain = [];
			type = '';
			this.lookup(uniformsObj);
			return { output:output, };
		},
	
	
		lookup : function(input){

			for (const name in input) {
				
				pathChain.push( name );
				indexChain.push( -1 );
				type = '';

				let prop = input[name];

				if(prop instanceof Array){
					
					type = prop[0];
					let len = prop[1];

					if(typeof type === 'string')
						for(let i=0; i<len; i++){
							indexChain[ indexChain.length-1 ] = i;
							this.addTo_output();
						}
					else if(typeof type === 'object'){
						for(let i=0; i<len; i++){
							indexChain[ indexChain.length-1 ] = i;
							this.lookup(prop[0]);
						}
					}

				}else if(typeof prop === 'object')
					this.lookup(prop);
				else if(typeof prop === 'string'){
					type = prop;
					this.addTo_output();
				}

				pathChain.pop();
				indexChain.pop();

			}

		},

		addTo_output : function(){
			var o = '';
			for(let i=0; i<pathChain.length; i++)			
				o += pathChain[i]
				  +  (indexChain[i]===-1? '' : '['+indexChain[i]+']')
				  +  (i<pathChain.length-1? '.' : '')
				;
			output[o] = type;
			//output.push(  );
		},

		update_objectPropsToOutputIndexes_tableObject : function(){

		},
	
	};
})();







var afterLoading = function(){

	var Obj3Dproto = get_Obj3Dproto_Class(math);



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
	






	var shaderCodes2 = zgl2.Shader.generate_standard({texture:'env'});
	shaderCodes2.debug();
	window.shaderObj2 = new zgl2.ShaderObject(shaderCodes2, {_v:3, _n:3}, {_mvp:'mat4', _mv:'mat4', _t:'sampler2D'});
		shaderObj2.attributes._v.data = vBuffer;
		shaderObj2.attributes._n.data = nBuffer;
		shaderObj2.uniforms._t.data = texture;
		shaderObj2.uniforms._mvp.data = projectionMatrix;
		shaderObj2.uniforms._mv.data = math.mat_id();
	shaderObj2.start();



	var shaderCodes3 = zgl2.Shader.generate_standard({});
	shaderCodes3.debug();
	window.shaderObj3 = new zgl2.ShaderObject(shaderCodes3, {_v:3}, {_mvp:'mat4'});



	function create_light(pos, col, dis, dec){ this.pos=pos; this.col=col; this.dis=dis; this.dec=dec; }

	var pLights = [
		new create_light( new Float32Array([1,2,3]), new Float32Array([.004,.05,.6]), 7, 8 ),
		new create_light( new Float32Array([1,2,3]), new Float32Array([.004,.05,.6]), 7, 8 )
	];
	var allUniformAccessNames = uniformsParser.parse( { _mvp:'mat4', _pl:[{pos:'vec3',col:'vec3',dis:'float',dec:'float'},2] } );
	window.shaderObj4 = new zgl2.ShaderObject(zGLSL.litStructTest, {_v:3}, allUniformAccessNames.output);
	
	
	var scene = {
		lights : {
			points : pLights
		}
	}

	

	var envTeaPot = new Obj3Dproto();

	//envTeaPot.material.shader = shaderObj3;
	envTeaPot.v = vBuffer;
	envTeaPot.c = cBuffer;
	envTeaPot.u = uBuffer;
	envTeaPot.n = nBuffer;
	envTeaPot.tex = texture;
	envTeaPot.pMat = projectionMatrix;
	Object.defineProperty(envTeaPot, 'vMat', { get:function(){
		return camera.viewMatrix
	} });
	Object.defineProperty(envTeaPot, 'mvMat', { get:function(){
		envTeaPot.update_modelMatrix();
		return math.mul_CM(this.vMat, envTeaPot.modelMatrix);
	} });
	Object.defineProperty(envTeaPot, 'mvpMat', { get:function(){
		return math.mul_CM(this.pMat, this.mvMat);
	} });
	envTeaPot.scene = scene;
	





	// EASY
	envTeaPot.add_shader(shaderObj4,
		{
			_v           : 'v',
			_mvp         : 'mvpMat',
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

	// VERY EASY
	envTeaPot.smartAdd_shader(shaderObj4,  {_v:'v', _mvp:'mvpMat', '_pl[]':'scene.lights.points'} );

	// VERY EASY + OPTI
	envTeaPot.set_shader(shaderObj4, {_v:'v'}, { _mvp:'mvpMat', '_pl[]':'scene.lights.points'} );







	//envTeaPot.add_shader(shaderObj2, {_v:'v', _n:'n', _mvp:'mvpMat', _mv:'mvMat', _t:'tex'});
	//envTeaPot.add_shader(shaderObj3, {_v:'v', _mvp:'mvpMat'});
	
	//envTeaPot.smartAdd_shader(shaderObj4,  {_v:'v', _mvp:'mvpMat', '_pl[]':'scene.lights.points'} );

	//envTeaPot.set_shader(shaderObj4, {_v:'v'}, { _mvp:'mvpMat', '_pl[]':'scene.lights.points'} );





	

	window.envTeaPot = envTeaPot;

	envTeaPot.pos.x = 20;
	envTeaPot.pos.y = 20;
	envTeaPot.pos.z = -30;








	var camera = new Obj3Dproto();
	camera.viewMatrix = camera.make_viewMatrix();

	window.camZpos.set.exec = function(val){
		camera.pos.z = val;
		camera.viewMatrix = camera.make_viewMatrix();
	};
	window.camera = camera;







	var uniformInfoMaker = uniformsParser;
	var zedGL_shaderUsing_examples = get_zedGL_shaderUsing_examples(
		zgl, uniformInfoMaker, Obj3Dproto,
		{v:vBuffer, c:cBuffer, u:uBuffer, n:nBuffer },
		texture
	);
	zedGL_shaderUsing_examples.onlyShaderObject.init();
	zedGL_shaderUsing_examples.obj3D_use_shaderObject.init();
	






	gl.clearColor(.1,.1,.1,1);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

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
		xRot += 0.005*1;
		yRot += 0.005*1;
		

		zedGL_shaderUsing_examples.onlyShaderObject.draw(xRot, yRot);
		zedGL_shaderUsing_examples.obj3D_use_shaderObject.draw(xRot, yRot);


/* 
		// HARD
		let modelMatrix = math.mul_CM( math.make_translation(-20,20,-30), yxRotMat );
		let mv = math.mul_CM(viewMat, modelMatrix);
		let mvp = math.mul_CM(projMat, mv);
		shaderObj4.attributes._v.data = vBuffer;
		shaderObj4.uniforms._mvp.data = mvp;
		shaderObj4.uniforms['_pl[0].pos'].data = pLights[0].pos;
		shaderObj4.uniforms['_pl[0].col'].data = pLights[0].col;
		shaderObj4.uniforms['_pl[0].dis'].data = pLights[0].dis;
		shaderObj4.uniforms['_pl[0].dec'].data = pLights[0].dec;
		shaderObj4.uniforms['_pl[1].pos'].data = pLights[1].pos;
		shaderObj4.uniforms['_pl[1].col'].data = pLights[1].col;
		shaderObj4.uniforms['_pl[1].dis'].data = pLights[1].dis;
		shaderObj4.uniforms['_pl[1].dec'].data = pLights[1].dec;
		shaderObj4.start();
		gl.drawArrays(gl.TRIANGLES, 0, 12096);

		// EASY
		envTeaPot.pos = {x:20,y:20,z:-30};
		envTeaPot.rot.x = xRot;
		envTeaPot.rot.y = yRot;
		envTeaPot.update_shaderData(0);
		gl.drawArrays(gl.TRIANGLES, 0, 12096);
		
		// VERY EASY
		envTeaPot.pos = {x:-20,y:-20,z:-30};
		envTeaPot.rot.x = xRot;
		envTeaPot.rot.y = yRot;
		envTeaPot.update_shaderData(1);
		gl.drawArrays(gl.TRIANGLES, 0, 12096);

		// VERA EASY + OPTI
		envTeaPot.pos = {x:20,y:-20,z:-30};
		envTeaPot.rot.x = xRot;
		envTeaPot.rot.y = yRot;
		envTeaPot.start_shader(2);
		gl.drawArrays(gl.TRIANGLES, 0, 12096);
 */
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



