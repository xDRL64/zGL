var zGL = {};

zGL.context = function(GLcontext){
    this.gl = GLcontext;
};




// for : vertices, colors, uvCoords, normals.
// get : GPU buffer reference
zGL.buffer_f32A = function(data){
    var gl = this.gl;
    var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vBuffer;
};

// for : face indices
// get : GPU buffer reference
zGL.buffer_ui16A = function(data){
    var gl = this.gl;
    var tBuffer= gl.createBuffer ();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
    return tBuffer;
};





// for : internal zGL
zGL._needsMipmap = function(minGLcode){
    var gl = this.gl;
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
zGL._set_tex = function(settings){
    var gl = this.gl;
    if(settings.magFilter)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, settings.magFilter);
    if(settings.minFilter)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, settings.minFilter);
    if(settings.wrapS)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, settings.wrapS);
    if(settings.wrapT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, settings.wrapT);
    if(settings.mipmap
    || !settings.mipmap && this._needsMipmap(settings.minFilter))
        gl.generateMipmap(gl.TEXTURE_2D);
};

// for : texture settings
// get : texture settings object
zGL.texSettings = function(o={magFilter, minFilter, wrapX, wrapY, mipmap}){
    var gl = this.gl;
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
zGL.tex_2D = function(src, settings){
    var gl = this.gl;
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    // user settings
    if(settings)
        this._set_tex(settings);
    // zGL default settings overwriting WebGL deaulft settingins
    else{
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
};




// for : internal zGL
zGL._build = function(code,type){
    var gl = this.gl;
    var shader = gl.createShader(type);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    return shader;
};

// for : vertex shader code
// get : GPU vertex bin reference
zGL.vBuild = function(code){
    var gl = this.gl;
    return this._build(code, gl.VERTEX_SHADER);
};

// for : fragment shader code
// get : GPU fragment bin reference
zGL.fBuild = function(code){
    var gl = this.gl;
    return this._build(code, gl.FRAGMENT_SHADER);
};

// for : bin shader
// get : GPU program reference
zGL.shader = function(vBin,fBin){
    var gl = this.gl;
    var prog = gl.createProgram();
	gl.attachShader(prog, vBin);
	gl.attachShader(prog, fBin);
	gl.linkProgram(prog);
    return prog;
};

// for : shader attribute names
// get : shader attribute index
zGL.attributes = function(prog, names){
    var gl = this.gl;
    var refs = {};
    for(var i=0; i<names.length; i++)
        refs[names[i]] = gl.getAttribLocation(prog, names[i]);
    return refs;
};

// for : shader uniform names
// get : shader uniform index
zGL.uniforms = function(prog, names){
    var gl = this.gl;
    var refs = {};
    for(var i=0; i<names.length; i++)
        refs[names[i]] = gl.getUniformLocation(prog, names[i]);
    return refs;
};

// for : enable attribute interpolation
zGL.connect_attrib = function(refAttrib, refData, sizeBytes, stepBytes=0, offsetBytes=0){
    var gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, refData);
	gl.vertexAttribPointer(refAttrib, sizeBytes, gl.FLOAT, false, stepBytes, offsetBytes);
    gl.enableVertexAttribArray(refAttrib);
};

// for : send several uniforms ( matrice or vectors or one value )
zGL.send_uniforms = function(uniforms, datas, format){
    var gl = this.gl;
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
zGL.link_textures = function(uniforms, dataRefs){
    var gl = this.gl;
    for(var i=0; i<uniforms.length; i++){
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, dataRefs[i]);
        gl.uniform1i(uniforms[i], i);
    }
};

// for : send one uniform ( matrice or vectors or one value )
zGL.send_uniform = function(uniform, data, format){
    var gl = this.gl;

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
zGL.link_texture = function(uniform, dataRef, texIndex){
    var gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + texIndex);
    gl.bindTexture(gl.TEXTURE_2D, dataRef);
    gl.uniform1i(uniform, texIndex);
};

// for : create pairs {ref, data} for shader element (attributes or uniforms)
zGL.ShaderPair = function(shaderElemRef, shaderElemData){
    var gl = this.gl;
    this.ref  = shaderElemRef;
    this.data = shaderElemData;
};

// for : check shader starters (set unused to [])
zGL.shaderStarter = function(o){
    var gl = this.gl;
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
zGL.start_shader = function(starter){
    var gl = this.gl;
    var o = starter;
    var i;
    gl.useProgram(o.prog);

    // VERT
    for(i=0; i<o.VERT.length; i++)
        this.connect_attrib(o.VERT[i].ref, o.VERT[i].data, 3);
    // NORM
    for(i=0; i<o.NORM.length; i++)
        this.connect_attrib(o.NORM[i].ref, o.NORM[i].data, 3);
    // COL
    for(i=0; i<o.COL.length; i++)
        this.connect_attrib(o.COL[i].ref, o.COL[i].data, 3);
    // UV
    for(i=0; i<o.UV.length; i++)
        this.connect_attrib(o.UV[i].ref, o.UV[i].data, 2);

    // TEX
    for(i=0; i<o.TEX.length; i++)
        this.link_texture(o.TEX[i].ref, o.TEX[i].data, i);

    // MAT2
    for(i=0; i<o.MAT2.length; i++)
        this.send_uniform(o.MAT2[i].ref, o.MAT2[i].data, "Matrix2fv");
    // MAT3
    for(i=0; i<o.MAT3.length; i++)
        this.send_uniform(o.MAT3[i].ref, o.MAT3[i].data, "Matrix3fv");
    // MAT4
    for(i=0; i<o.MAT4.length; i++)
        this.send_uniform(o.MAT4[i].ref, o.MAT4[i].data, "Matrix4fv");
    
    // V1f
    for(i=0; i<o.V1f.length; i++)
        this.send_uniform(o.V1f[i].ref, o.V1f[i].data, "1fv");
    // V2f
    for(i=0; i<o.V2f.length; i++)
        this.send_uniform(o.V2f[i].ref, o.V2f[i].data, "2fv");
    // V3f
    for(i=0; i<o.V3f.length; i++)
        this.send_uniform(o.V3f[i].ref, o.V3f[i].data, "3fv");
    // V4f
    for(i=0; i<o.V4f.length; i++)
        this.send_uniform(o.V4f[i].ref, o.V4f[i].data, "4fv");

    // V1i
    for(i=0; i<o.V1i.length; i++)
        this.send_uniform(o.V1i[i].ref, o.V1i[i].data, "1iv");
    // V2i
    for(i=0; i<o.V2i.length; i++)
        this.send_uniform(o.V2i[i].ref, o.V2i[i].data, "2iv");
    // V3i
    for(i=0; i<o.V3i.length; i++)
        this.send_uniform(o.V3i[i].ref, o.V3i[i].data, "3iv");
    // V4i
    for(i=0; i<o.V4i.length; i++)
        this.send_uniform(o.V4i[i].ref, o.V4i[i].data, "4iv");

    // FLOAT
    for(i=0; i<o.FLOAT.length; i++)
        this.send_uniform(o.FLOAT[i].ref, o.FLOAT[i].data, "1f");
    // INT
    for(i=0; i<o.INT.length; i++)
        this.send_uniform(o.INT[i].ref, o.INT[i].data, "1i");

};


// for : create pairs {ref, data} for shader element (attributes or uniforms)
zGL.draw_triangles = function(triangleRef){
    var gl = this.gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleRef);
    gl.drawElements(gl.TRIANGLES, 4032*3, gl.UNSIGNED_SHORT, 0);


    //gl.drawArrays(gl.TRIANGLES, 0, 22);
};


zGL.removeSomeIndices = function(array, maxVal){
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