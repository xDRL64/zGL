var zImporter = {};

zImporter.FBX = function(FBX, objName){
    var FBXrawBasicMesh = zFBX.get_rawBasicMesh(FBX, objName);
    var zFBXdirectMesh = this.get_directFromFBXmesh(FBXrawBasicMesh);
    var zGLmesh = this.triangulate_zFBXdirectMesh(zFBXdirectMesh);
    return zGLmesh;
};

// get_zglDirectMesh34
zImporter.get_directFromFBXmesh = function(FBXmesh){
    var o = {v:[], c:[], u:[], n:[], f:FBXmesh.f, t:[]};
    var vertCountByFace = 0;
    var buffer = [];
    buffer.iStart = 0;
    FBXmesh.available = zFBX.get_availableProps(FBXmesh);
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
};

//                                   inRef    in         out
zImporter.make_directFace = function(face, FBXmesh, zFBXdirectMesh){

    var directFace = this.get_directFace(face, FBXmesh);

    zFBXdirectMesh.v = zFBXdirectMesh.v.concat(directFace.v);

    for(var iProp=0; iProp<FBXmesh.available.length; iProp++){
        var p = FBXmesh.available[iProp];
        zFBXdirectMesh[ p ] = zFBXdirectMesh[ p ].concat( directFace[p] )
    }

};

// reconstitue une face (3-4vert, 3-4col, 3-4uv, 3-4normal)
zImporter.get_directFace = function(face, FBXmesh){

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
};




zImporter.triangulate_zFBXdirectMesh = function(directMesh){
    
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

zImporter.get_directVertex = function(directMesh, index, vec3,vec2){
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

zImporter.insert_AnyDirect = function(zGLmesh, anyDirect){
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

zImporter.quadToTriangle = function(quad){
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

