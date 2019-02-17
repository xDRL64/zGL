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




	function Obj3Dproto(){
		this.pos = {x:0, y:0, z:0};
		this.rot = {x:0, y:0, z:0};
		this.sca = {x:1, y:1, z:1};

		this.modelMatrix = null;
	
		this.v = null;
		this.c = null;
		this.u = null;
		this.n = null;

		this.shaders = [];
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
	Obj3Dproto.prototype.add_shader = function(shaderObject, linkRefs){
		var obj3D = this;
		var linkRefGetters = {};
		for(let name in linkRefs)
			Object.defineProperty(linkRefGetters, name, {
					get :  eval( '(function(){ return obj3D.'+linkRefs[name]+';})' ),
					enumerable : true,
			} );
		this.shaders.push(
			{
				obj      : shaderObject,
				//linkRefs : linkRefs
				linkRefs : linkRefGetters
			}
		);
	};
	Obj3Dproto.prototype.smartAdd_shader = function(shaderObject, linkRefs){
		var obj3D = this;
		var linkRefGetters = {};
		var uniformNames = Object.keys(shaderObject.uniforms);
		for(let name in linkRefs){

			let foundArray = name.indexOf('[]');
			let foundObject = name.indexOf('.');
			let foundPointer = foundArray!==-1? foundArray : foundObject;

			if( foundPointer !== -1 ){
				let prefix = name.substr(0, foundPointer);
				uniformNames.forEach( function(U_name){
					let uNameInfo = U_name.match('^'+prefix+'(.*)');
					if(uNameInfo){
						let propName = linkRefs[name] + uNameInfo[1];
						Object.defineProperty(linkRefGetters, U_name, {
							get :  eval( '(function(){ return obj3D.'+propName+';})' ),
							enumerable : true,
						} );  
					}
				} );
			//}else if( name.includes('.') !== -1 ){

			}else{
				Object.defineProperty(linkRefGetters, name, {
						get :  eval( '(function(){ return obj3D.'+linkRefs[name]+';})' ),
						enumerable : true,
				} );
			}
		}
		this.shaders.push(
			{
				obj      : shaderObject,
				linkRefs : linkRefGetters
			}
		);
	};
	Obj3Dproto.prototype.updateShaderObject_data = function(iShader=0, start=false){
		var shader = this.shaders[iShader];
		var linkRefs = shader.linkRefs;
		var shaderPropNames = Object.keys(linkRefs);
		for(let name of shaderPropNames){
			let shaderInput = shader.obj.attributes[name] || shader.obj.uniforms[name];
			let obj3DpropName = linkRefs[name];
			//shaderInput.data = this[obj3DpropName];
			shaderInput.data = obj3DpropName;
		}
		
		if(start) shader.obj.start();
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
	//window.shaderObj2 = new zgl2.ShaderObject(shaderCodes2, {_v:3, _n:3}, {_mvp:'mat4', _mv:'mat4', _t:'sampler2D', _pl:'object'});
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
		new create_light( new Float32Array([1,2,3]), new Float32Array([4,5,6]), 7, 8 ),
		new create_light( new Float32Array([11,22,33]), new Float32Array([44,55,66]), 77, 88 )
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
	
	envTeaPot.add_shader(shaderObj2, {_v:'v', _n:'n', _mvp:'mvpMat', _mv:'mvMat', _t:'tex'});
	envTeaPot.add_shader(shaderObj3, {_v:'v', _mvp:'mvpMat'});
	
	envTeaPot.smartAdd_shader(shaderObj4, {_v:'v', _mvp:'mvpMat', '_pl[]':'scene.lights.points'} );



	window.envTeaPot = envTeaPot;

	envTeaPot.pos.x = 20;
	envTeaPot.pos.z = -30;








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






		// Obj3D proto test
		envTeaPot.rot.x = xRot;
		envTeaPot.rot.y = yRot;
		envTeaPot.updateShaderObject_data(2, true);
		gl.drawArrays(gl.TRIANGLES, 0, 12096);
 







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
