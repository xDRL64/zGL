"use strict";

import {Math as math} from './ZGL.ext.Math.m.js';

function zGL_Geometry_ext (zgl){
	

	//var math = null;
	this.test_math = function(){
		console.log(math);
		console.log(math2);
	};


	// supprime les données (vertices, colors, UVs, normals)
	// re-index les donnée liées aux faces
	function remove_doubles(zGLmesh){
		var ignored = [];
		var faceIndex = [];
		var count = zGLmesh.v.length / 3;
		for(var iMain=0; iMain<count; iMain++)
			if(ignored.indexOf(iMain) == -1){
				
				var iMainFace = parseInt(iMain / 3);
				var iMainPlace = iMain % 3;
				//faceIndex[(iMainFace*3) + iMainPlace] = iMain;
				faceIndex[iMain] = iMain;
				for(var iComp=0; iComp<count; iComp++)
					if(ignored.indexOf(iComp) == -1)
	
						if(iMain != iComp)
							if(this.compare_vcun(zGLmesh, iMain, iComp)){ console.log(iMain,iComp);
								var iCompFace = parseInt(iComp / 3);
								var iCompPlace = iComp % 3;
	
								faceIndex[ (iCompFace*3) + iCompPlace] = iMain;
								ignored.push(iComp);
							}
			}
	
		zGLmesh.f = faceIndex;
		this.remove_vcun(zGLmesh, ignored)
	
	};
	
	// retourne true si les vcun indiqué par iA et iB dans zGLmesh some les meme
	// sinon retourne false
	function compare_vcun(zGLmesh, iA, iB){
		var vec3 = zGLmesh.vec3;
		var vec2 = zGLmesh.vec2;
		var areTheSame = true;
	
		for(var iVec=0; iVec<vec3.length; iVec++){
			var p = vec3[iVec];
			for(var i=0; i<3; i++)
				if(zGLmesh[ p ][ (iA*3)+i ] != zGLmesh[ p ][ (iB*3)+i ]){
					areTheSame = false;
					break;
				}
		}
	
		if(areTheSame)
		for(var iVec=0; iVec<vec2.length; iVec++){
			var p = vec2[iVec];
			for(var i=0; i<2; i++)
				if(zGLmesh[ p ][ (iA*2)+i ] != zGLmesh[ p ][ (iB*2)+i ]){
					areTheSame = false;
					break;
				}
		}
	
		return areTheSame;
	}
	
	function remove_vcun(zGLmesh, unused){
	
		// remove face indexes
		var faceIndex = zGLmesh.f;
		var faceCount = faceIndex.length;
		unused.sort(function(a,b){return b-a;});
	
		for(var iRem=0; iRem<unused.length; iRem++){
			var toRemove = unused[iRem];
			for(var iF=0; iF<faceCount; iF++)
				if(faceIndex[iF] >= toRemove)
					faceIndex[iF]--;
		}
	
		// remove vcun
		var o = {};
		var vec3 = zGLmesh.vec3;
		var vec2 = zGLmesh.vec2;
		var allvec = vec3.concat(vec2);
		for(var iVec=0; iVec<allvec.length; iVec++)
			o[ allvec[iVec] ] = [];
			
		var count = zGLmesh.v.length / 3;
		for(var iVCUN=0; iVCUN<count; iVCUN++)
			if(unused.indexOf(iVCUN) == -1){
				for(var iVec=0; iVec<vec3.length; iVec++){
					var p = vec3[iVec];
					for(var i=0; i<3; i++)
						o[ p ].push( zGLmesh[ p ][ (iVCUN*3)+i ] );
				}
	
				for(var iVec=0; iVec<vec2.length; iVec++){
					var p = vec2[iVec];
					for(var i=0; i<2; i++)
						o[ p ].push( zGLmesh[ p ][ (iVCUN*2)+i ] );
				}
			}
	
		for(var iVec=0; iVec<allvec.length; iVec++)
			zGLmesh[ allvec[iVec] ] = o[ allvec[iVec] ];
		zGLmesh.f = faceIndex;
	};

	this.remove_doubles = remove_doubles;
	this.compare_vcun   = compare_vcun;
	this.remove_vcun    = remove_vcun;





	function triangulate_zglDirectMesh34(directMesh){
		
		var buffer = {v:[], c:[], u:[], n:[]};
		var o = {v:[], c:[], u:[], n:[]};

		var vec3 = ["v"];
		var vec2 = [];
		var available = directMesh.available;
		for(var i=0; i<available.length; i++){
			if     (available[i] == "c") vec3.push("c");
			else if(available[i] == "n") vec3.push("n");
			else if(available[i] == "u") vec2.push("u");
		}
		var vertCount = 0;
		var faceTypes = directMesh.t;
		for(var iFace=0; iFace<faceTypes.length; iFace++){

			var directVerts = [];
			for(var iVert=0; iVert<faceTypes[iFace]; iVert++){
				directVerts.push( this.get_directVertex(directMesh, vertCount, vec3,vec2) );
				vertCount++;
			}
			directVerts.vec3 = vec3;
			directVerts.vec2 = vec2;

				
			if(faceTypes[iFace] == 3)
				this.insert_AnyDirect(o, directVerts);
			else if(faceTypes[iFace] == 4){
				var tris = this.quadToTriangle(directVerts);
				this.insert_AnyDirect(o, tris);
			}
			
		}

		o.vec3 = vec3;
		o.vec2 = vec2;
		return o;
	};

	function get_directVertex(directMesh, index, vec3,vec2){
		var buffer = {};

		for(var iVec=0; iVec<vec3.length; iVec++){
			var p = vec3[iVec];
			buffer[ p ] = [];
			for(var i=0; i<3; i++)
				buffer[ p ].push( directMesh[ p ][ (index*3)+i ] );
		}
		for(var iVec=0; iVec<vec2.length; iVec++){
			var p = vec2[iVec];
			buffer[ p ] = [];
			for(var i=0; i<2; i++)
				buffer[ p ].push( directMesh[ p ][ (index*2)+i ] );
		}
		return buffer;
	}

	function insert_AnyDirect(zGLmesh, anyDirect){
		var vec3 = anyDirect.vec3;
		var vec2 = anyDirect.vec2;

		for(var iAny=0; iAny<anyDirect.length; iAny++){
			var any = anyDirect[iAny];
			for(var i=0; i<vec3.length; i++)
				zGLmesh[ vec3[i] ] = zGLmesh[ vec3[i] ].concat( any[ vec3[i] ] );
			for(var i=0; i<vec2.length; i++)
				zGLmesh[ vec2[i] ] = zGLmesh[ vec2[i] ].concat( any[ vec2[i] ] );
		}
	}

	function quadToTriangle(quad){
		var vec3 = quad.vec3;
		var vec2 = quad.vec2;
		var A = {};
		var B = {};
		// in  : 0 1 2 3
		// out : 0 1 2 - 0 2 3
		for(var i=0; i<vec3.length; i++){
			var p = vec3[i];
			A[ p ] = quad[0][ p ].concat( quad[1][ p ] ).concat( quad[2][ p ] );
			B[ p ] = quad[0][ p ].concat( quad[2][ p ] ).concat( quad[3][ p ] );
		}
				
		for(var i=0; i<vec2.length; i++){
			var p = vec2[i];
			A[ p ] = quad[0][ p ].concat( quad[1][ p ] ).concat( quad[2][ p ] );
			B[ p ] = quad[0][ p ].concat( quad[2][ p ] ).concat( quad[3][ p ] );
		}
		var o = [A,B];
		o.vec3 = vec3;
		o.vec2 = vec2;
		return o;
	};

	this.triangulate_zglDirectMesh34 = triangulate_zglDirectMesh34;
	this.get_directVertex            = get_directVertex;
	this.insert_AnyDirect            = insert_AnyDirect;
	this.quadToTriangle              = quadToTriangle;
	
};

var _ext = new zGL_Geometry_ext();
export { _ext as Geometry };