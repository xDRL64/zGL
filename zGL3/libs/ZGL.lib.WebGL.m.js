"use strict";

function zGL_WebGL_lib (gl) {



	function clear_viewport(){
		gl.clearColor(1, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		var z = 0;
		for(let i=0; i<100; i++)
			z = (2**i) / (i+1);
	};
	this.clear_viewport = clear_viewport;



	// for : vertices, colors, uvCoords, normals.
	// get : GPU buffer reference
	function buffer_f32A(data){
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		return vBuffer;
	};
	
	// for : face indices
	// get : GPU buffer reference
	function buffer_ui16A(data){
		var tBuffer= gl.createBuffer ();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
		return tBuffer;
	};
	
	

	// for : internal zGL
	function _needsMipmap(minGLcode){
		if(minGLcode === undefined)
			return true;
		else{
			var GLcodes = [
				gl.NEAREST_MIPMAP_NEAREST,
				gl.LINEAR_MIPMAP_NEAREST,
				gl.NEAREST_MIPMAP_LINEAR,
				gl.LINEAR_MIPMAP_LINEAR
			];
			for(var i=0; i<GLcodes.length; i++)
				if(minGLcode == GLcodes[i])
					return true;
		}
		return false;
	};
	
	// for : internal zGL
	function _set_tex(settings){
		if(settings.magFilter)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, settings.magFilter);
		if(settings.minFilter)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, settings.minFilter);
		if(settings.wrapS)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, settings.wrapS);
		if(settings.wrapT)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, settings.wrapT);
		if(settings.mipmap
		|| !settings.mipmap && _needsMipmap(settings.minFilter))
			gl.generateMipmap(gl.TEXTURE_2D);
	};
	
	// for : texture settings
	// get : texture settings object
	function texSettings(o={magFilter, minFilter, wrapX, wrapY, mipmap}){
		var settings = {};
		if(o.magFilter) settings.magFilter = gl[o.magFilter.toUpperCase()];          
		if(o.minFilter) settings.minFilter = gl[o.minFilter.toUpperCase()];
		if(o.wrapX) settings.wrapS = gl[o.wrapX.toUpperCase()];
		if(o.wrapY) settings.wrapT = gl[o.wrapY.toUpperCase()];
		if(o.mipmap !== undefined) settings.mipmap = o.mipmap;  
		return settings;
	};
	
	// for : texture
	// get : GPU texture reference
	function tex_2D(src, settings){
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		//gl.activeTexture(gl.TEXTURE0);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
		// user settings
		if(settings)
			_set_tex(settings);
		// zGL default settings overwriting WebGL deaulft settingins
		else{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
		gl.bindTexture(gl.TEXTURE_2D, null);
		return texture;
	};
	
	
	
	
	// for : internal zGL
	function _build(code,type){
		var shader = gl.createShader(type);
		gl.shaderSource(shader, code);
		gl.compileShader(shader);
		console.log(gl.getShaderInfoLog(shader));
		return shader;
	};
	
	// for : vertex shader code
	// get : GPU vertex bin reference
	function vBuild(code){
		return _build(code, gl.VERTEX_SHADER);
	};
	
	// for : fragment shader code
	// get : GPU fragment bin reference
	function fBuild(code){
		return _build(code, gl.FRAGMENT_SHADER);
	};
	
	// for : bin shader
	// get : GPU program reference
	function shader(vBin,fBin){
		var prog = gl.createProgram();
		gl.attachShader(prog, vBin);
		gl.attachShader(prog, fBin);
		gl.linkProgram(prog);
		return prog;
	};
	
	// for : shader attribute names
	// get : shader attribute index
	function get_attributes(prog, names){
		var refs = {};
		for(var i=0; i<names.length; i++)
			refs[names[i]] = gl.getAttribLocation(prog, names[i]);
		return refs;
	};
	
	// for : shader uniform names
	// get : shader uniform index
	function get_uniforms(prog, names){
		var refs = {};
		for(var i=0; i<names.length; i++)
			refs[names[i]] = gl.getUniformLocation(prog, names[i]);
		return refs;
	};
	
	// for : enable attribute interpolation
	function connect_attrib(refAttrib, refData, sizeBytes, stepBytes=0, offsetBytes=0){
		gl.bindBuffer(gl.ARRAY_BUFFER, refData);
		gl.vertexAttribPointer(refAttrib, sizeBytes, gl.FLOAT, false, stepBytes, offsetBytes);
		gl.enableVertexAttribArray(refAttrib);
	};
	
	// for : send several uniforms ( matrice or vectors or one value )
	function send_uniforms(uniforms, datas, format){
		var isMatrix = format.includes("Matrix");
		var isVector = format.includes("v");
		if(isMatrix || isVector){
			if(format.includes("i")) var _32Array = Int32Array;
			if(format.includes("f")) var _32Array = Float32Array;
		}else var isValue = true;
	
		if(isMatrix)
			for(var i=0; i<uniforms.length; i++)
				gl[("uniform"+format)](uniforms[i], false, new _32Array(datas[i]));
		else if(isVector)
			for(var i=0; i<uniforms.length; i++)
				gl[("uniform"+format)](uniforms[i], new _32Array(datas[i]));
		else if(isValue)
			for(var i=0; i<uniforms.length; i++)
				gl[("uniform"+format)](uniforms[i], datas[i]);
	};
	
	// for : link several textures to current shader
	function link_textures(uniforms, dataRefs){
		for(var i=0; i<uniforms.length; i++){
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, dataRefs[i]);
			gl.uniform1i(uniforms[i], i);
		}
	};
	
	// for : send one uniform ( matrice or vectors or one value )
	function send_uniform(uniform, data, format){
	
		if(format.includes("Matrix"))
			gl[("uniform"+format)](uniform, false, new Float32Array(data));
		else if(format.includes("v")){
			if(format.includes("i"))
				gl[("uniform"+format)](uniform, new Int32Array(data));
			if(format.includes("f"))
				gl[("uniform"+format)](uniform, new Float32Array(data));
		}else
			gl[("uniform"+format)](uniform, data);
	};
	
	// for : link one texture to current shader
	function link_texture(uniform, dataRef, texIndex){
		gl.activeTexture(gl.TEXTURE0 + texIndex);
		gl.bindTexture(gl.TEXTURE_2D, dataRef);
		gl.uniform1i(uniform, texIndex);
	};
	
	// for : create pairs {ref, data} for shader element (attributes or uniforms)
	function ShaderPair(shaderElemRef, shaderElemData){
		this.ref  = shaderElemRef;
		this.data = shaderElemData;
	};
	
	// for : check shader starters (set unused to [])
	function shaderStarter(o){
		return {
			prog  : o.prog  || [],
			VERT  : o.VERT  || [],
			NORM  : o.NORM  || [],
			COL   : o.COL   || [],
			UV    : o.UV    || [],
			TEX   : o.TEX   || [],
			MAT2  : o.MAT2  || [],
			MAT3  : o.MAT3  || [],
			MAT4  : o.MAT4  || [],
			V1f   : o.V1f   || [],
			V2f   : o.V2f   || [],
			V3f   : o.V3f   || [],
			V4f   : o.V4f   || [],
			V1i   : o.V1i   || [],
			V2i   : o.V2i   || [],
			V3i   : o.V3i   || [],
			V4i   : o.V4i   || [],
			FLOAT : o.FLOAT || [],
			INT   : o.INT   || []
		};
	};
	
	// for : start shader
	function start_shader(starter){
		var o = starter;
		var i;
		gl.useProgram(o.prog);
	
		// VERT
		for(i=0; i<o.VERT.length; i++)
			connect_attrib(o.VERT[i].ref, o.VERT[i].data, 3);
		// NORM
		for(i=0; i<o.NORM.length; i++)
			connect_attrib(o.NORM[i].ref, o.NORM[i].data, 3);
		// COL
		for(i=0; i<o.COL.length; i++)
			connect_attrib(o.COL[i].ref, o.COL[i].data, 3);
		// UV
		for(i=0; i<o.UV.length; i++)
			connect_attrib(o.UV[i].ref, o.UV[i].data, 2);
	
		// TEX
		for(i=0; i<o.TEX.length; i++)
			link_texture(o.TEX[i].ref, o.TEX[i].data, i);
	
		// MAT2
		for(i=0; i<o.MAT2.length; i++)
			send_uniform(o.MAT2[i].ref, o.MAT2[i].data, "Matrix2fv");
		// MAT3
		for(i=0; i<o.MAT3.length; i++)
			send_uniform(o.MAT3[i].ref, o.MAT3[i].data, "Matrix3fv");
		// MAT4
		for(i=0; i<o.MAT4.length; i++)
			send_uniform(o.MAT4[i].ref, o.MAT4[i].data, "Matrix4fv");
		
		// V1f
		for(i=0; i<o.V1f.length; i++)
			send_uniform(o.V1f[i].ref, o.V1f[i].data, "1fv");
		// V2f
		for(i=0; i<o.V2f.length; i++)
			send_uniform(o.V2f[i].ref, o.V2f[i].data, "2fv");
		// V3f
		for(i=0; i<o.V3f.length; i++)
			send_uniform(o.V3f[i].ref, o.V3f[i].data, "3fv");
		// V4f
		for(i=0; i<o.V4f.length; i++)
			send_uniform(o.V4f[i].ref, o.V4f[i].data, "4fv");
	
		// V1i
		for(i=0; i<o.V1i.length; i++)
			send_uniform(o.V1i[i].ref, o.V1i[i].data, "1iv");
		// V2i
		for(i=0; i<o.V2i.length; i++)
			send_uniform(o.V2i[i].ref, o.V2i[i].data, "2iv");
		// V3i
		for(i=0; i<o.V3i.length; i++)
			send_uniform(o.V3i[i].ref, o.V3i[i].data, "3iv");
		// V4i
		for(i=0; i<o.V4i.length; i++)
			send_uniform(o.V4i[i].ref, o.V4i[i].data, "4iv");
	
		// FLOAT
		for(i=0; i<o.FLOAT.length; i++)
			send_uniform(o.FLOAT[i].ref, o.FLOAT[i].data, "1f");
		// INT
		for(i=0; i<o.INT.length; i++)
			send_uniform(o.INT[i].ref, o.INT[i].data, "1i");
	
	};
	
	
	// for : create pairs {ref, data} for shader element (attributes or uniforms)
	function draw_triangles(triangleRef){
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleRef);
		gl.drawElements(gl.TRIANGLES, 4032*3, gl.UNSIGNED_SHORT, 0);
	
	
		//gl.drawArrays(gl.TRIANGLES, 0, 22);
	};
	
	
	function removeSomeIndices(array, maxVal){
		var newArray = [];
		for(var i=0; i<array.length; i += 3)
			if(array[i] < maxVal
			&& array[i+1] < maxVal
			&& array[i+2] < maxVal){
				var fixLen = newArray.length;
				newArray[fixLen]   = array[i];
				newArray[fixLen+1] = array[i+1];
				newArray[fixLen+2] = array[i+2];
			}
				
		return newArray;
	};

















	

	// attribute dataInfo : size || {size, type, normalized, stride, offset}
	// uniform dataInfo : dataType:{'int', 'float', 'ivec2', 'vec2', 'ivec3', 'vec3', 'ivec4', 'vec4', 'mat2', 'mat3', 'mat4', 'sampler2D'}
	function _ShaderInput(location, dataInfo){
		this.location = location;
		this.dataInfo = dataInfo;
		var data = null;
		Object.defineProperty(this, 'data', {
			get : () => data,
			set : (value) => data = value
		});
	}

	var _Attribute = (function(){

		// class
		//

		function _Attribute(location, dataInfo){

			// heritage
			// -> this.location
			// -> this.dataInfo
			// -> this.data(get/set)
			_ShaderInput.apply(this, arguments);
	
			// code
			if(typeof dataInfo === 'object'){
				this.size       = dataInfo.size       || 3;
				this.type       = dataInfo.type       || gl.FLOAT;
				this.normalized = dataInfo.normalized || false;
				this.stride     = dataInfo.stride     || 0;
				this.offset     = dataInfo.offset     || 0;
			}else{
				this.size       = dataInfo;
				this.type       = gl.FLOAT;
				this.normalized = false;
				this.stride     = 0;
				this.offset     = 0;
			}

			this.start = this.start;
		}

		// heritage
		//

		_Attribute.prototype = Object.create(_ShaderInput.prototype);
		_Attribute.prototype.constructor = _Attribute;
		Object.setPrototypeOf(_Attribute, _ShaderInput);

		// public static props
		//

		_Attribute.activateds = new Array(256);
		_Attribute.activateds.fill(false);

		// public methods
		//

		_Attribute.prototype.start = function(){
			gl.bindBuffer(gl.ARRAY_BUFFER, this.data);
			gl.vertexAttribPointer(this.location, this.size, this.type, this.normalized, this.stride, this.offset);
		}

		return _Attribute;
	})();

	var _Uniform = (function(){
		
		// class
		//

		function _Uniform(location, dataInfo){

			// heritage
			// -> this.location
			// -> this.dataInfo
			// -> this.data(get/set)
			_ShaderInput.apply(this, arguments);

			// private props
			//
			
			var _GL = _list[dataInfo];
			var args = [];
			args.push(location);
			if(dataInfo.includes("mat"))
				args.push(false);
			
				
			
			this.start = _start.bind(this, _GL, args);
		}

		// heritage
		//

		_Uniform.prototype = Object.create(_ShaderInput.prototype);
		_Uniform.prototype.constructor = _Uniform;
		Object.setPrototypeOf(_Uniform, _ShaderInput);

		// public methods
		//



		// private methods
		//

		function _start(_GL, args){
			
			args[_GL.iLastArg] = _GL.format(this.data);
			_GL.method.apply(gl, args);
		}
		
		function _connect_texture(location, data){
			var iTex = _Uniform.iTexture;
			//gl.activeTexture(gl.TEXTURE+(iTex<10?'0':'') + iTex);
			gl.activeTexture(gl.TEXTURE0 + iTex);
			_Uniform.iTexture++;
			gl.bindTexture(gl.TEXTURE_2D, data);
			gl.uniform1i(location, iTex);
		}

		// public satic props
		//
		_Uniform.iTexture = 0;

		// private satic props
		//
		var _fArray = data=>new Float32Array(data);
		var _iArray = data=>new Int32Array(data);
		var _1Value = data=>data;
		var _list = {
			'float'     : { method:gl.uniform1f,        iLastArg:1, format:_1Value },
			'int'       : { method:gl.uniform1i,        iLastArg:1, format:_1Value },
			'vec2'      : { method:gl.uniform2fv,       iLastArg:1, format:_fArray },
			'ivec2'     : { method:gl.uniform2iv,       iLastArg:1, format:_iArray },
			'vec3'      : { method:gl.uniform3fv,       iLastArg:1, format:_fArray },
			'ivec3'     : { method:gl.uniform3iv,       iLastArg:1, format:_iArray },
			'vec4'      : { method:gl.uniform4fv,       iLastArg:1, format:_fArray },
			'ivec4'     : { method:gl.uniform4iv,       iLastArg:1, format:_iArray },
			'mat2'      : { method:gl.uniformMatrix2fv, iLastArg:2, format:_fArray },
			'mat3'      : { method:gl.uniformMatrix3fv, iLastArg:2, format:_fArray },
			'mat4'      : { method:gl.uniformMatrix4fv, iLastArg:2, format:_fArray },
			'sampler2D' : { method:_connect_texture,    iLastArg:1, format:_1Value }
		}
		

		return _Uniform;
	})();



	// ShaderObject Using :
	
	// 0. Create instance : give glsl codes, attributes to get, uniforms to get

	// 1. change the attribs/uniforms data value before re-/starting ShaderObject to draw

	// 2. run the shaderInstance.start method

	// 3. to draw

	// And So On...

	// 4. change the attribs/uniforms data value before re-/starting ShaderObject to draw

	// 5. run the shaderInstance.start method

	// 6. to draw


	/* codes      = { vertex:string, fragment:string }
	   attributes = { name:dataInfo, ..., ..., ...,  }
	   uniforms   = { name:dataInfo, ..., ..., ...,  } */
	// attribute dataInfo : size || {size, type, normalized, stride, offset}
	// uniform dataInfo : dataType/TextureId
	var ShaderObject = (function(){

		// class
		//
		function ShaderObject(codes={}, attributes={}, uniforms={}){
			
			var vBin = vBuild(codes.vertex);
			var fBin = fBuild(codes.fragment);

			this.prog = shader(vBin,fBin);
	
			var A_names = Object.keys(attributes);
			var U_names = Object.keys(uniforms);
	
			var A_locations = get_attributes(this.prog, A_names);
			var U_locations = get_uniforms(this.prog, U_names);
	
			this.attributes = [];
			A_names.forEach( (name)=>{
				this.attributes[name] = new _Attribute(A_locations[name], attributes[name]);
				this.attributes.push( this.attributes[name] );
			} );
	
			this.uniforms = [];
			U_names.forEach( (name)=>{
				this.uniforms[name] = new _Uniform(U_locations[name], uniforms[name]);
				this.uniforms.push( this.uniforms[name] );
			} );

			this.start = this.start;
		}

		// private props
		//

		

		// private methods
		//

		function _update_enabledAttribs(shaderObj){
			// active/desactive l'interpolation en fonction du nombre d'attributes pour 'this' instance de ShaderObject 
			var firstDisabled = _Attribute.activateds.indexOf(false);
			var diff = shaderObj.attributes.length - firstDisabled;
		
			// (CODE CONTENT : hardcore otpimisation)
			if(diff < 0)
				// disable
				for(let i=0; i>diff; i--){
					let iAttr = firstDisabled + i - 1;
					_Attribute.activateds[iAttr] = false;
					gl.enableVertexAttribArray(iAttr);
				}
			else
				// enable
				for(let i=0; i<diff; i++){
					let iAttr = firstDisabled + i;
					_Attribute.activateds[iAttr] = true;
					gl.enableVertexAttribArray(iAttr);
				}
		}
	
		// public methods
		//

		ShaderObject.prototype.start = function(){

			_update_enabledAttribs(this);

			gl.useProgram(this.prog);

			this.attributes.forEach( (attr)=>{attr.start();} );

			_Uniform.iTexture = 0;
			this.uniforms.forEach( (unif)=>{unif.start();} );

		}
	
		ShaderObject.prototype.tell = function(){
			console.log(_Attribute.activateds);
		}

		return ShaderObject;
	})();


	this.ShaderObject = ShaderObject;













	this.buffer_f32A       = buffer_f32A;
	this.buffer_ui16A      = buffer_ui16A;
	//this._needsMipmap      = _needsMipmap;
	//this._set_tex          = _set_tex;
	this.texSettings       = texSettings;
	this.tex_2D            = tex_2D;
	//this._build            = _build;
	this.vBuild            = vBuild;
	this.fBuild            = fBuild;
	this.shader            = shader;
	this.get_attributes    = get_attributes;
	this.get_uniforms      = get_uniforms;
	this.connect_attrib    = connect_attrib;
	this.send_uniforms     = send_uniforms;
	this.link_textures     = link_textures;
	this.send_uniform      = send_uniform;
	this.link_texture      = link_texture;
	this.ShaderPair        = ShaderPair;
	this.shaderStarter     = shaderStarter;
	this.start_shader      = start_shader;
	this.draw_triangles    = draw_triangles;
	this.removeSomeIndices = removeSomeIndices;

}

export {zGL_WebGL_lib};