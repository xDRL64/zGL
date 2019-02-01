"use strict";

function zGL_Default_lib (gl) {

	function clear_viewport(){
		gl.clearColor(1, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		var z = 0;
		for(let i=0; i<100; i++)
			z = (2**i) / (i+1);
	};
	this.clear_viewport = clear_viewport;



}

export {zGL_Default_lib};