var canvasElem = document.getElementById('viewport');


zgl = new zGL(canvasElem);

zgl.Loader.addToLoading("myFbx", "any", "teapot.fbx");

var afterLoading = function(){

	fbx = zgl.FBX.parse(zgl.Loader.data.myFbx);
	console.log(fbx);

	zglMesh = zgl.FBX.import(fbx, 'Utah_Teapot_Quads');
	console.log(zglMesh);

	//props = zgl.FBX.get_availableProps(zglMesh);
	//console.log(props);
};

zgl.Loader.callback = afterLoading;
zgl.Loader.load();



var test_perfs = function(func, loopCount){
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

