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
	this.remove_doubles = function(zGLmesh){
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
	this.compare_vcun = function(zGLmesh, iA, iB){
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
	
	this.remove_vcun = function(zGLmesh, unused){
	
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

};

var Geometry = new zGL_Geometry_ext();

export {Geometry};