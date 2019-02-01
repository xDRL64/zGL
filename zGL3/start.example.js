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