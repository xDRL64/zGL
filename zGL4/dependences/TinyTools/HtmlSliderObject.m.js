"use strict";


function HtmlSliderObject(o={id, name, min, max, step, value, pxWidth, editDisplay}){
			
	var rangeInput = document.createElement('INPUT');
	rangeInput.type        = 'range';
	rangeInput.id          = o.id      || '';
	rangeInput.name        = o.name    || '';
	rangeInput.min         = o.min     || 0;
	rangeInput.max         = o.max     || 10;
	rangeInput.step        = o.step    || 1;
	rangeInput.value       = o.value   || 0;
	rangeInput.style.width = o.pxWidth || '';
	rangeInput.oninput = function(){
		numberInput.value = this.valueAsNumber;
		changed(this.value);
	}

	var label = document.createElement('LABEL');
	label.textContent = o.name || o.id || 'slider : ';

	var valueDisplayer = document.createElement('SPAN');
	valueDisplayer.textContent = rangeInput.value;

	var numberInput = document.createElement('INPUT');
	numberInput.type = 'number';
	numberInput.style.width = '100px';
	numberInput.value = o.value || 0;
	numberInput.lang = 'en-US';
	numberInput.step = o.step || 1;
	numberInput.oninput = function(){
		rangeInput.value = this.valueAsNumber;
		changed(this.value);
	};

	o.editDisplay = o.editDisplay===false? false : true;
	if(o.editDisplay)
		valueDisplayer.hidden = true;
	else
		numberInput.hidden = true;
	
	var container = document.createElement('SPAN');
	container.appendChild(label);
	container.appendChild(rangeInput);
	container.appendChild(valueDisplayer);
	container.appendChild(numberInput);

	this.htmlElem = container;

	var _value = o.value || 0;
	this.get = {exec : function(val){}};
	this.set = {exec : function(val){}};
	var changed = (function(val){
		_value = val;
		valueDisplayer.textContent = val;
		this.set.exec(val);
	}).bind(this);
	Object.defineProperty(this, 'value', {
		get : function(){
			this.get.exec(val);
			return _value
		},
		set : function(val){
			this.htmlElem.value = val;
			changed(val);
		}
	});
}

export {HtmlSliderObject}