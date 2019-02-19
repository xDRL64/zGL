"use strict";

function get_Obj3Dproto_Class(math){
	
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
				linkRefs : linkRefGetters
			}
		);
	};
	Obj3Dproto.prototype.update_shaderData = function(iShader=0, start=true){
		var shader = this.shaders[iShader];
		var linkRefs = shader.linkRefs;
		var shaderPropNames = Object.keys(linkRefs);
		for(let name of shaderPropNames){
			let shaderInput = shader.obj.attributes[name] || shader.obj.uniforms[name];
			shaderInput.data = linkRefs[name];
		}
		
		if(start) shader.obj.start();
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
	/*
	Obj3Dproto.prototype.smartUpdate_shaderData = function(iShader=0, start=true){
		var shader = this.shaders[iShader];
		var linkRefs = shader.linkRefs;
		var shaderPropNames = Object.keys(linkRefs);
		for(let name of shaderPropNames){
			let shaderInput = shader.obj.attributes[name] || shader.obj.uniforms[name];
			let obj3DpropName = linkRefs[name];
			shaderInput.data = obj3DpropName;
		}
		
		if(start) shader.obj.start();
	};
	*/
	
	
	
	Obj3Dproto.prototype.set_shader = function(shaderObject, A_linkRefs, U_linkRefs){
		var obj3D = this;
		
		// ATTRIBUTES
		var A_starters = [];
		for(let A_name in A_linkRefs){
			let attribute = shaderObject.attributes[A_name];
	
			let o = {};
	
			Object.defineProperty(o, 'data', {
				get :  eval( '(function(){ return obj3D.'+A_linkRefs[A_name]+';})' ),
			} );
	
			o.index = attribute.index;
	
			o.start = function(){
				attribute.externalStart( this.data );
			};
	
			A_starters.push( o );
		}
	
		// UNIFORMS
		var U_starters = [];
		var uniformNames = Object.keys(shaderObject.uniforms);
		for(let U_name in U_linkRefs){
			
			let foundArray = U_name.indexOf('[]');
			let foundObject = U_name.indexOf('.');
			let foundPointer = foundArray!==-1? foundArray : foundObject;
	
			// complex uniform
			if( foundPointer !== -1 ){
				let prefix = U_name.substr(0, foundPointer);
				uniformNames.forEach( function(uName){
					let uNameInfo = uName.match('^'+prefix+'(.*)');
					if(uNameInfo){
						let uniform = shaderObject.uniforms[uName];
						let o = {};
						let propName = U_linkRefs[U_name] + uNameInfo[1];
						Object.defineProperty(o, 'data', {
							get :  eval( '(function(){ return obj3D.'+propName+';})' ),
						} );
						o.index = uniform.index;
						o.start = function(){
							uniform.externalStart( this.data );
						};
						U_starters.push( o );
					}
				} );
			}
			// simple uniform
			else{
				let uniform = shaderObject.uniforms[U_name];
	
				let o = {};
	
				Object.defineProperty(o, 'data', {
					get :  eval( '(function(){ return obj3D.'+U_linkRefs[U_name]+';})' ),
				} );
	
				o.index = uniform.index;
	
				o.start = function(){
					uniform.externalStart( this.data );
				};
	
				U_starters.push( o );
			}
		}
	
		this.shaders.push(
			{
				obj      : shaderObject,
				A_starters : A_starters,
				U_starters : U_starters,
			}
		);
	};
	Obj3Dproto.prototype.start_shader = function(iShader=0){
		var shader = this.shaders[iShader];
		shader.obj.externalStart();
	
		shader.A_starters.forEach( function(starter){starter.start();} );
		shader.U_starters.forEach( function(starter){starter.start();} );
	};

	return Obj3Dproto;
}