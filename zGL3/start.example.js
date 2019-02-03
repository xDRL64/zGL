var canvasElem = document.getElementById('viewport');


zgl = new zGL(canvasElem);
zgl2 = new zGL(canvasElem);

zgl.Loader.addToLoading("myFbx", "any", "teapot.fbx");
zgl.Loader.addToLoading("myImage","img","./TEX64.png");

var afterLoading = function(){

	/* var fbx = zgl.FBX.parse(zgl.Loader.data.myFbx);
	console.log(fbx);

	var zglMesh = zgl.FBX.import(fbx, 'Utah_Teapot_Quads');
	console.log(zglMesh); */


	
	gl.clearColor(1,1,0,1);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

	// ATTRIBUTES DATA
	var vBuffer = zgl.buffer_f32A(vData);
	var nBuffer = zgl.buffer_f32A(nData);
	var uBuffer = zgl.buffer_f32A(uData);
	var tBuffer = zgl.buffer_ui16A(tData);
	
	// UNIFORMS DATA
	var canvasAspect = zgl.domElem.width / zgl.domElem.height;
	var projectionMatrix = math.ColMat_proj(90, canvasAspect, 0.001, 1000);
	var modelviewMatrix = math.mat_id();
	
	// TEXTURES DATA
    var texSettings = zgl.texSettings({mipmap:false});
	var tex2D = zgl.tex_2D(Loader.data.myImage, texSettings);

	// SHADERS DATA
    var shader   = zGLSL.texSmoothLighting();
    var vBin     = zgl.vBuild(shader.vertex);
    var fBin     = zgl.fBuild(shader.fragment);
	var sProg    = zgl.shader(vBin,fBin);
    var attribs  = zgl.attributes(sProg, ["aVertexPosition","aNormalDirection","aTextureCoord"]);
    var uniforms = zgl.uniforms(sProg, ["uMVMatrix","uPMatrix","uSampler","oneFloat"]);

	// SHADERS SETTINGS 
    var verticesPair = new zgl.ShaderPair(attribs["aVertexPosition"],  vBuffer);
    var normalsPair  = new zgl.ShaderPair(attribs["aNormalDirection"], nBuffer);
    var uvCoordsPair = new zgl.ShaderPair(attribs["aTextureCoord"],    uBuffer);
    var modelMatPair = new zgl.ShaderPair(uniforms["uMVMatrix"],       modelviewMatrix);
    var projMatPair  = new zgl.ShaderPair(uniforms["uPMatrix"],        projectionMatrix);
    var oneFloatPair = new zgl.ShaderPair(uniforms["oneFloat"],        1.0);
    var texturePair  = new zgl.ShaderPair(uniforms["uSampler"],        tex2D);
    var shaderStarter = zgl.shaderStarter({
        prog  : sProg,
        VERT  : [verticesPair],
        NORM  : [normalsPair],
        UV    : [uvCoordsPair],
        MAT4  : [modelMatPair,projMatPair],
        FLOAT : [oneFloatPair],
        TEX   : [texturePair]
    });

	// DRAWING
    zgl.start_shader(shaderStarter);
	zgl.draw_triangles(tBuffer);
	
	var xRot = 0;
	var yRot = 0;
	var loop = function(){
		requestAnimationFrame(loop);

		//modelMatPair.data = math.mul_CM( math.makeRotationX(xRot), math.mat_trans40z() );
		let yxRotMat = math.mul_CM( math.makeRotationY(yRot), math.makeRotationX(xRot) );
		modelMatPair.data = math.mul_CM( math.mat_trans40z(), yxRotMat );
		xRot += 0.1;
		yRot += 0.1;

		zgl.start_shader(shaderStarter);
		zgl.draw_triangles(tBuffer);
		
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
