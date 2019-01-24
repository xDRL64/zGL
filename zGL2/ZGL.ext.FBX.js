this.ZGL_Initializer.ext.FBX = function(zgl){
	// compatible : FBX2010 & BlenderExporter

	// private statics
	var that = this;

	this.lib = {

		parser : {

			parse : function(str){
				var o = {};
				var i = 0;
				var size = str.length;
				var comment = false;
				var NODE = 0x01;
				var PROP = 0x02;
				var todo = "nothings";
				var justOutNode = false;
				var buffer = "";
				var depth = 0;
				var depthType = [NODE];
				var depthStack = [o];
				while(i < size){
			
					if(str[i] == ";")
						comment = true;
			
					if(!comment){
						
						if(depthType[depth] == NODE){
							if(str[i]!=":" && str[i]!="}" && str[i]!=" " && str[i]!="\t" && str[i]!="\n")
								buffer += str[i];
							else{
								if(str[i] == ":"){
									var res = this.search(str,i);
									todo = res[0];
									i = res[1];
								}
							}
							if(str[i] == "}"){
								depthStack.pop();
								depthType.pop();
								depth--;
								justOutNode = true;
							}
						}
			
						if(depthType[depth] == PROP){
							var res = this.search(str,i);
							i = res[1];
							while(res[2] != "ret"){
								
								if(res[0]=="node" && res[2]=="in"){
									todo = "node";
									break;
								}else if(res[2] == "num"){
									var resNum = this.parseNumber(str, i);
									buffer = resNum[0];
									i = resNum[1];
								}else if(res[2] == "str"){
									var resNum = this.parseQuot(str, i);
									buffer = resNum[0];
									i = resNum[1];
								}else if(res[2] == "a-z"){
			
									var resNum = this.parse_09azAZ(str, i);
									buffer = resNum[0];
									i = resNum[1];
			
								}else if(res[2] == "sep"){
									depthStack[depth].push(buffer);
									buffer = "";
									i++;
								}
			
								res = this.search(str,i);
								i = res[1];
							}
			
							if(res[2] == "ret"){
								if(!justOutNode)
									depthStack[depth].push(buffer);
								
								buffer = "";
								//i++;
								depthStack.pop();
								depthType.pop();
								depth--;
							}
						}
			
			
						if(todo == "node"){
							var name = this.checkPropName(depthStack[depth], buffer);
							depthStack[depth] [name] = {};
							var newNode = depthStack[depth] [name];
			
							depth++;
							depthStack[depth] = newNode;
							depthType[depth] = NODE;
			
							buffer = "";
							todo = "nothings";
						}
			
			
						if(todo == "prop"){
							var name = this.checkPropName(depthStack[depth], buffer);
							depthStack[depth] [name] = [];
							var newProp = depthStack[depth] [name];
			
							depth++;
							depthStack[depth] = newProp;
							depthType[depth] = PROP;
			
							buffer = "";
							todo = "nothings";
			
							i--;
						}
						
					}
			
					justOutNode = false;
			
					if(comment && str[i] == "\n")
						comment = false;
			
					//console.log("fbx parser : i = ", i, str[i]);
					i++;
				}
				return o;
			},
			
			parseQuot : function(str, i){
				var o = ['',NaN];
				if(str[i] == '"'){
					i++;
					while(str[i] != '"'){
						o[0] += str[i];
						i++;
					}
					//o[0] += '"';
					o[1] = i+1;
					return o;
				}
			},
			
			parseNumber : function(str, i){
				var o = ['',NaN];
				var floatFlag = false;
				while(Number.isInteger(parseInt(str[i])) || str[i]=="." || str[i]=="-" || str[i]=="e"){
					o[0] += str[i];
					if(str[i] == ".") floatFlag = true;
					i++;
				}
				if(floatFlag) o[0] = parseFloat(o[0]);
				else          o[0] = parseInt(o[0]);
				o[1] = i;
				return o;
				
			},
			
			parse_09azAZ : function(str, i){
				var o = [str[i],NaN];
				i++;
				while(this._09azAZ(str[i])){
					o[0] += str[i];
					i++;
				}
				o[1] = i;
				return o;
			},
			
			_09azAZ : function(letter){
				var ascii = letter.charCodeAt(0)
				if(ascii==95
				|| ascii>=48 && ascii<=57
				|| ascii>=97 && ascii<=122
				|| ascii>=65 && ascii<=90)
					return true;
				return false;
			},
			
			_azAZ : function(letter){
				var ascii = letter.charCodeAt(0)
				if(ascii==95
				|| ascii>=97 && ascii<=122
				|| ascii>=65 && ascii<=90)
					return true;
				return false;
			},
			
			checkPropName : function(node, name){
				if(node[name]){
					var i = 1;
					while(node[name+i])
						i++;
					return name+i;
				}
				return name;
			},
			
			search : function(str, i){
				while(i < str.length){
					if(str[i] == "{") return ["node",i,"in"];
					//if(str[i] == "}") return ["node",i,"out"];
					if(str[i] == '"') return ["prop",i,"str"];
			
					if(this._azAZ(str[i])) return ["prop",i,"a-z"];
			
					if(str[i]=='-' && Number.isInteger(parseInt(str[i+1]))
					|| Number.isInteger(parseInt(str[i])))
						return ["prop",i,"num"];
			
					if(str[i] == ',') return ["prop",i,"sep"];
					if(str[i-1] != ',' && str[i] == '\n') return ["prop",i,"ret"];
					i++;
				}
			},

			test_showzgl : function(){
				console.log("zgl", zgl);
			},
		},


		extractor : {

			get_Objects : function(FBX){
				return FBX.Objects;
			},
			
			get_ModelCount : function(FBXdefinitions){
				var ObjectTypeCount = FBXdefinitions.Count[0];
				var model;
				for(var i=0; i<ObjectTypeCount; i++)
					if(model = FBXdefinitions[i? "ObjectType"+i : "ObjectType"]["Model"])
						return model.Count[0];
				return 0;
			},
			
			get_Model : function(FBX, modelName){
				var Objects = this.get_Objects(FBX);
				var modelCount = this.get_ModelCount(FBX.Definitions);
				var Model;
				for(var i=0; i<modelCount; i++){
					if(Model = Objects[i? "Model"+i : "Model"]){
						if(Model[0] == "Model::"+modelName)
							return Model.Mesh;
					}
				}
			},
			
			// extract : FBX basic object
			// get : vertices, color, UVs, normals, faces
			get_basicMesh : function(FBX, objName){
			
				var Mesh = this.get_Model(FBX, objName);
			
				var vertices = Mesh.Vertices;
			
				var faces = Mesh.PolygonVertexIndex;
			
				var colors;
				if(Mesh.LayerElementColor){
					colors       = {};
					colors.map   = Mesh.LayerElementColor[0].MappingInformationType[0];
					colors.ref   = Mesh.LayerElementColor[0].ReferenceInformationType[0];
					colors.data  = Mesh.LayerElementColor[0].Colors;
					colors.index = Mesh.LayerElementColor[0].ColorIndex;
					colors.size  = 3;
				}
			
				var normals;
				if(Mesh.LayerElementNormal){
					normals       = {};
					normals.map   = Mesh.LayerElementNormal[0].MappingInformationType[0];
					normals.ref   = Mesh.LayerElementNormal[0].ReferenceInformationType[0];
					normals.data  = Mesh.LayerElementNormal[0].Normals;
					normals.index = Mesh.LayerElementNormal[0].NormalsIndex;
					normals.size  = 3;
				}
			
				var UVs;
				if(Mesh.LayerElementUV){
					UVs       = {};
					UVs.map   = Mesh.LayerElementUV[0].MappingInformationType[0];
					UVs.ref   = Mesh.LayerElementUV[0].ReferenceInformationType[0];
					UVs.data  = Mesh.LayerElementUV[0].UV;
					UVs.index = Mesh.LayerElementUV[0].UVIndex;
					UVs.size  = 2;
				}
			
				return {v:vertices, c:colors, u:UVs, n:normals, f:faces};
			},
			
			get_availableProps : function(zFBXrawBasicMesh){
				var possible = ["c","u","n"];
				var available = [];
				for (var i=0; i<possible.length; i++)
					if(zFBXrawBasicMesh[possible[i]])
						available.push(possible[i]);
				return available;
			},

		},


		convertor : {

			// convert : indexed to direct
			// from    : vertices, color, UVs, normals, faces
			// get     : vertices, color, UVs, normals, types
			get_zglDirectMesh34 : function(FBXmesh){
				var o = {v:[], c:[], u:[], n:[], f:FBXmesh.f, t:[]};
				var vertCountByFace = 0;
				var buffer = [];
				buffer.iStart = 0;
				FBXmesh.available = extractor.get_availableProps(FBXmesh);
				o.available = FBXmesh.available;
				for(var i=0; i<FBXmesh.f.length; i++){
					vertCountByFace++;
			
					var vertIndex = FBXmesh.f[i];
					if(vertIndex < 0){
			
						o.t.push(vertCountByFace);
						vertCountByFace = 0;
			
						vertIndex = (vertIndex*(-1))-1;
						buffer.push(vertIndex);
			
						this.make_directFace(buffer, FBXmesh, o);
						buffer = [];
						buffer.iStart = i+1;
					}else
						buffer.push(vertIndex);
				}
				return o;
			},

			//                         inRef    in         out
			make_directFace : function(face, FBXmesh, zFBXdirectMesh){

				var directFace = this.get_directFace(face, FBXmesh);

				zFBXdirectMesh.v = zFBXdirectMesh.v.concat(directFace.v);

				for(var iProp=0; iProp<FBXmesh.available.length; iProp++){
					var p = FBXmesh.available[iProp];
					zFBXdirectMesh[ p ] = zFBXdirectMesh[ p ].concat( directFace[p] )
				}

			},

			// reconstitue une face (3-4vert, 3-4col, 3-4uv, 3-4normal)
			get_directFace : function(face, FBXmesh){

				var directFace = {v:[], c:[], u:[], n:[]};

				for(var iVert=0; iVert<face.length; iVert++){

					// GET VERTICE
					for(var iData=0; iData<3; iData++)
						directFace.v.push( FBXmesh.v[ (face[iVert]*3)+iData ] );

					// GET available prop : COLOR / UV / NORMAL
					for(var iProp=0; iProp<FBXmesh.available.length; iProp++){
						var p = FBXmesh.available[iProp];
						var prop = FBXmesh[ p ];

						if(prop.map == "ByPolygonVertex")
							var from_index = face.iStart + iVert;
						else if(prop.map == "ByVertice" || prop.map == "ByVertex")
							var from_index = face[iVert];

						if(prop.ref == "Direct")
							var finalIndex = from_index * prop.size;
						else if(prop.ref == "IndexToDirect")
							var finalIndex = prop.index[from_index] * prop.size;

						for(var iData=0; iData<prop.size; iData++)
							directFace[ p ].push( FBXmesh[ p ].data[ finalIndex+iData ] );
					}
				}

				return directFace;
			},

		},


		importer : {

			// Extract and Convert :
			// Extract : FBX Mesh Object from FBX (Scene/File) Object 
			// Convert : FBX Mesh to zGL Direct Mesh (with typed faces : 3-4)
			import : function(FBX, objName){

				// FBX obj with only : vertices, colors, uvs, normals, faces, (still indexed)
				var FBXbasicMesh = extractor.get_basicMesh(FBX, objName);

				// zGL direct mesh 3-4 faces, (not indexed)
				// contains : vertices, color, UVs, normals, types
				var zFBXdirectMesh = convertor.get_zglDirectMesh34(FBXbasicMesh);

				/* var zGLmesh = this.triangulate_zFBXdirectMesh(zFBXdirectMesh);
				return zGLmesh; */
				return zFBXdirectMesh;
			},
			
			

		},
	}

	// private vars (in the scope)
	var parser    = this.lib.parser;
	var extractor = this.lib.extractor;
	var convertor = this.lib.convertor;
	var importer  = this.lib.importer;


	// public methods (for developpers using zGL)
	this.parse   = parser.parse.bind(parser);
	this.import  = importer.import.bind(importer);
	
};

