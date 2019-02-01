"use strict";

function zGL_Loader_ext (zgl){

	this.loading = 0;

	this.waiting = [];
	
	this.callback = null;
	
	this.data = {};


	// private statics
	var that = this;



	// public methods
	this.addToLoading = function(varName, type, src){
		this.waiting.push([varName, type, src]);
		this.loading++;
	};
	
	this._onEndImg = function(){
		that.loading--;
		if(that.loading == 0)
			that.callback();
	};
	
	this._onEndJson = function(){
		//console.log(this.responseText)
		if (this.readyState == 4 && this.status == "200"){
			that.data[this.theapp.params] = JSON.parse(this.responseText);
		
			that.loading--;
			if(that.loading == 0)
				that.callback();
		}
	};
	
	this._onEndAny = function(){
		//console.log(this.responseText)
		if (this.readyState == 4 && this.status == "200"){
			that.data[this.theapp.params] = this.responseText;
		
			that.loading--;
			if(that.loading == 0)
				that.callback();
		}
	};
	
	this._runOneLoad = function(entry){
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
	
	this._anyFileType = function(varName, src){
		var o = new XMLHttpRequest();
		o.theapp = {params:varName};
		o.onreadystatechange = this._onEndAny;
		//o.onloadend = function(){ console.log("rrrrr") };
		o.overrideMimeType("application/text");
		o.open('GET', src, true);
		o.send(null);
	};
	
	this.load = function(){
		for(var i=0; i<this.waiting.length; i++)
			this._runOneLoad(this.waiting[i]);
	};
	
};

var Loader = new zGL_Loader_ext();

export {Loader};