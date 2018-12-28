var zLoader = {};

zLoader.loading = 0;

zLoader.waiting = [];

zLoader.callback = null;

zLoader.data = {};

zLoader.addToLoading = function(varName, type, src){
    this.waiting.push([varName, type, src]);
    this.loading++;
};

zLoader._onEndImg = function(){
    zLoader.loading--;
    if(zLoader.loading == 0)
        zLoader.callback();
};

zLoader._onEndJson = function(){
    //console.log(this.responseText)
    if (this.readyState == 4 && this.status == "200"){
        zLoader.data[this.theapp.params] = JSON.parse(this.responseText);
    
        zLoader.loading--;
        if(zLoader.loading == 0)
            zLoader.callback();
    }
};

zLoader._onEndAny = function(){
    //console.log(this.responseText)
    if (this.readyState == 4 && this.status == "200"){
        zLoader.data[this.theapp.params] = this.responseText;
    
        zLoader.loading--;
        if(zLoader.loading == 0)
            zLoader.callback();
    }
};

zLoader._runOneLoad = function(entry){
    if(entry[1] == "img"){
        var o = new Image();
        o.onload = this._onEndImg;
        this.data[entry[0]] = o;
        o.src = entry[2];
    }

    if(entry[1] == "json"){
        var o = new XMLHttpRequest();
        o.theapp = {params:entry[0]};
        o.onreadystatechange = this._onEndJson;
        //o.onloadend = function(){ console.log("rrrrr") };
        o.overrideMimeType("application/json");
        o.open('GET', entry[2], true);
        o.send(null);
    }

    if(entry[1] == "any"){
        this._anyFileType(entry[0],entry[2])
    }

};

zLoader._anyFileType = function(varName, src){
    var o = new XMLHttpRequest();
    o.theapp = {params:varName};
    o.onreadystatechange = this._onEndAny;
    //o.onloadend = function(){ console.log("rrrrr") };
    o.overrideMimeType("application/text");
    o.open('GET', src, true);
    o.send(null);
};

zLoader.load = function(){
    for(var i=0; i<this.waiting.length; i++)
        this._runOneLoad(this.waiting[i]);
};


