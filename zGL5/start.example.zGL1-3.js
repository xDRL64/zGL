var canvasElem = document.getElementById('viewport');

zgl = new zGL(canvasElem);
zgl2 = new zGL(canvasElem);

zgl.Loader.addToLoading("myFbx", "any", "teapot.fbx");
zgl.Loader.addToLoading("myImage","img","./TEX64.png");









var afterLoading = function(){

	gl.clearColor(1,1,0,1);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);


	var fbxObj = zgl.FBX.parse(zgl.Loader.data.myFbx);
	console.log(fbxObj);

	var directMesh34 = zgl.FBX.import(fbxObj, 'Utah_Teapot_Quads');
	console.log(directMesh34);
	
	var directMesh3 = zgl.Geometry.triangulate_zglDirectMesh34(directMesh34);
	console.log(directMesh3);

	// ATTRIBUTES DATA
	var vBuffer = zgl.buffer_f32A(directMesh3.v);
	var nBuffer = zgl.buffer_f32A(directMesh3.n);
	var uBuffer = zgl.buffer_f32A(directMesh3.u);
	
	var cBuffer = zgl.buffer_f32A(directMesh3.v);



	// ATTRIBUTES DATA
	//var vBuffer = zgl.buffer_f32A(vData);
	//var nBuffer = zgl.buffer_f32A(nData);
	//var uBuffer = zgl.buffer_f32A(uData);
	//var tBuffer = zgl.buffer_ui16A(tData);
	//
	//var cData = vData;
	//var cBuffer = zgl.buffer_f32A(cData);
	



	// SWITCHING SHADER TEST
	var shaderCodes = zgl.Shader.generate_standard({color:true, texture:'uv'});
	window.shaderObj   = new zgl.ShaderObject(shaderCodes, {_v:3, _c:3, _u:2}, {_m:'mat4', _t:'sampler2D'});
		shaderObj.attributes._v.data = vBuffer;
		shaderObj.attributes._c.data = cBuffer;
		shaderObj.attributes._u.data = uBuffer;
		shaderObj.uniforms._m.data = math.ColMat_proj(90, zgl.domElem.width/zgl.domElem.height, 0.001, 1000);
		shaderObj.uniforms._t.data = zgl.tex_2D(Loader.data.myImage, zgl.texSettings({mipmap:false}));
	shaderObj.start();


	var shaderCodes2 = zgl2.Shader.generate_standard({});
	window.shaderObj2   = new zgl2.ShaderObject(shaderCodes2, {_v:3,}, {_m:'mat4'});
		shaderObj2.attributes._v.data = vBuffer;
		shaderObj2.uniforms._m.data = math.ColMat_proj(90, zgl2.domElem.width/zgl2.domElem.height, 0.001, 1000);
	shaderObj2.start();


	shaderObj.start();






	// UNIFORMS DATA
	var canvasAspect = zgl.domElem.width / zgl.domElem.height;
	var projectionMatrix = math.ColMat_proj(90, canvasAspect, 0.001, 1000);
	var modelviewMatrix = math.mat_id();
	
	// TEXTURES DATA
    var texSettings = zgl.texSettings({mipmap:false});
	var tex2D = zgl.tex_2D(Loader.data.myImage, texSettings);

	// SHADERS DATA
    var shader   = zGLSL.colTexSmoothLighting();
    var vBin     = zgl.vBuild(shader.vertex);
    var fBin     = zgl.fBuild(shader.fragment);
	var sProg    = zgl.shader(vBin,fBin);
    var attribs  = zgl.get_attributes(sProg, ["aVertexPosition","aNormalDirection","aTextureCoord", 'aVertexColor']);
    var uniforms = zgl.get_uniforms(sProg, ["uMVMatrix","uPMatrix","uSampler","oneFloat", 'time']);

	// SHADERS SETTINGS 
    var verticesPair = new zgl.ShaderPair(attribs["aVertexPosition"],  vBuffer);
    var normalsPair  = new zgl.ShaderPair(attribs["aNormalDirection"], nBuffer);
    var uvCoordsPair = new zgl.ShaderPair(attribs["aTextureCoord"],    uBuffer);
    var modelMatPair = new zgl.ShaderPair(uniforms["uMVMatrix"],       modelviewMatrix);
    var projMatPair  = new zgl.ShaderPair(uniforms["uPMatrix"],        projectionMatrix);
    var oneFloatPair = new zgl.ShaderPair(uniforms["oneFloat"],        1.0);
	var texturePair  = new zgl.ShaderPair(uniforms["uSampler"],        tex2D);
	
	var timePair     = new zgl.ShaderPair(uniforms["time"],            Date.now());
	var colorsPair   = new zgl.ShaderPair(attribs["aVertexColor"],     cBuffer);

    var shaderStarter = zgl.shaderStarter({
        prog  : sProg,
        VERT  : [verticesPair],
        NORM  : [normalsPair],
        UV    : [uvCoordsPair],
        MAT4  : [modelMatPair,projMatPair],
        FLOAT : [oneFloatPair, timePair],
		TEX   : [texturePair],
		
		COL   : [colorsPair]
    });

	// DRAWING
    //zgl.start_shader(shaderStarter);
	//zgl.draw_triangles(tBuffer);
	
	var xRot = 0;
	var yRot = 0;
	var startTime = Date.now();
	var loop = function(){
		requestAnimationFrame(loop);

		//modelMatPair.data = math.mul_CM( math.makeRotationX(xRot), math.make_translation(0,0,-40) );
		let yxRotMat = math.mul_CM( math.makeRotationY(yRot), math.makeRotationX(xRot) );
		modelMatPair.data = math.mul_CM( math.make_translation(0,0,-40), yxRotMat );
		xRot += 0.005;
		yRot += 0.005;

		timePair.data =( Date.now() - startTime) / 100;
		
		zgl.start_shader(shaderStarter);
		
		/* if(timePair.data > Math.PI/2)
			startTime = Date.now(); */


		//zgl.draw_triangles(tBuffer);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.drawArrays(gl.TRIANGLES, 0, 12096);
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
