function add_htmlSlider(id, name, min, max, step, value, pxWidth, addBR=true){
	var slider = new HtmlSliderObject({id:id, name:name, min:min, max:max, step:step, value:value, pxWidth:pxWidth});
	var parent = document.getElementById('camPosRotDebugHtmlInterface');
	parent.appendChild(slider.htmlElem);
	
	if(id) window[id] = slider;
	else
		if(name) window[name] = slider;

	if(addBR) parent.appendChild(document.createElement('BR'));
}

function add_BR(){
	var parent = document.getElementById('camPosRotDebugHtmlInterface');
	parent.appendChild(document.createElement('BR'));
}


add_htmlSlider('camXpos', 'xPos', -100, 100, 0.1, 0, '200px');
add_htmlSlider('camYpos', 'yPos', -100, 100, 0.1, 0, '200px');
add_htmlSlider('camZpos', 'zPos', -100, 100, 0.1, 0, '200px');

add_BR();

add_htmlSlider('camXrot', 'xRot', -100, 100, 0.1, 0, '200px');
add_htmlSlider('camYrot', 'yRot', -100, 100, 0.1, 0, '200px');
add_htmlSlider('camZrot', 'zRot', -100, 100, 0.1, 0, '200px');