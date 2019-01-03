zgl = new ZGL();
//debugger
zgl.Loader.addToLoading("myFbx", "any", "teapot.fbx");
var afterLoading = function(){
	fbx = zgl.FBX.parser(zgl.Loader.data.myFbx);
	console.log(fbx);
	zglMesh = zgl.FBX.get_rawBasicMesh(fbx, 'Utah_Teapot_Quads');
	console.log(zglMesh);
	props = zgl.FBX.get_availableProps(zglMesh);
	console.log(props);
};
zgl.Loader.callback = afterLoading;
zgl.Loader.load();

