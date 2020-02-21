/**
 * @export
 * @nocollapse
 * @class AutoComplete : simple autocomplete / based on https://www.w3schools.com/howto/howto_js_autocomplete.asp
 * @url https://nicopr.fr/autocomplete
 */
class AutoComplete {
	
	/**
	 * @construct
	 * @param {Element} el : 
	 * @param {*} options : 
	 */
	constructor(el, options) {
		this._options = {};
		this.setOptions(options);
		this._element = el;
		this._value = "";
		this._current = -1;
		this._down = false;
		
		this._element.classList.add("ac");
		
		this._input = document.createElement("input");
		this._input.setAttribute("type", "search");
		this._input.setAttribute("placeholder", this._options.placeHolder);
		this._element.appendChild(this._input);
		
		this._cpl = document.createElement("div");
		this._cpl.style.maxHeight = this._options.boxMaxHeight;
		this._cpl.classList.add("ac-items");
		this._element.appendChild(this._cpl);
		
		let events = {"input": this.onInput, "click": this.onClick, "keydown": this.onKeyDown, "blur": this.onBlur};
		for(let event in events) this._input.addEventListener(event, events[event].bind(this));
	
		this._cpl.addEventListener("mousedown", this.onMouseDown.bind(this));
	}
	
	onInput(e) {
		this._value = this._input.value.toLowerCase();
		this.closeResults();
		if(!this._options.allowOpen && (this._value.length < this._options.minChars || this._cpl.childElementCount)) return;
		this.openResults(this.filter());
		this._options.onInput(this._value);
	}
	
	addResult(result) {
		let b = document.createElement("div");
		if(this._options.highlight) b.innerHTML = this.highlight(result[this._options.labelField]);
		else b.innerHTML = result[this._options.labelField];
		b.setAttribute("data-value", this._options.allData.findIndex(value => value[this._options.labelField] == result[this._options.labelField]));
		b.addEventListener("click", this.select.bind(this));
		this._cpl.appendChild(b);
	}
	
	filter() {
		return this._options.allData.filter(value => value[this._options.searchField].toLowerCase().indexOf(this._value) != -1);
	}
	
	highlight(label) {
		let found = label.toLowerCase().indexOf(this._value);
		let high = document.createElement("span");
		high.innerHTML = label.slice(found, found + this._value.length);
		return label.slice(0, found) + high.outerHTML + label.slice(found + this._value.length, label.length);
	}
	
	select(e) {
		let index = e.target.getAttribute("data-value");
		let selected = this._options.allData[index];
		this._input.value = selected[this._options.labelField];
		this._value = this._input.value.toLowerCase();
		this._down = false;
		this.closeResults();
		this._options.onSelect(selected[this._options.displayField], selected, index);
	}
	
	onClick(e) {
		if(this._cpl.childElementCount) return this.closeResults();
		if(this._options.allowOpen && !this._value) this.openResults(this._options.allData);
		else this.onInput(null);
	}
	
	onKeyDown(e) {
		let x = this._cpl.childNodes;
		if([40, 38, 13, 27].indexOf(e.keyCode) != -1) e.preventDefault();
		switch(e.keyCode) {
			case 40: // down
				if(this._current == -1) this.onInput(null);
				this._current++;
				this.activeResult(x);
				break;
				
			case 38: // up
				this._current--;
				this.activeResult(x);
				break;
				
			case 13: // enter
				if(this._current != -1) x[this._current].click();
				else {
					if(this._options.custom) {
						if(this._input.value.length >= this._options.minChars) this._options.onSelect(this._input.value, undefined, -1);
					}
					else if(this._cpl.childElementCount == 1) x[0].click();
					this.closeResults();
				}
				break;
				
			case 27: // esc
				this.closeResults();
				break;
		}
	}
	
	onBlur(e) {
		if(this._down) return;
		this.closeResults();
	}
	
	onMouseDown(e) {
		this._down = true;
	}
	
	activeResult(x) {
		if(!x.length) return;
		this.inactiveResult(x);
		this._current = this._current < 0 ? x.length - 1 : (this._current > x.length - 1 ? 0 : this._current);
		x[this._current].classList.add("ac-active");
		x[this._current].scrollIntoView();
	}
	
	inactiveResult(x) {
		for(let i = 0, l = x.length; i < l; i++) x[i].classList.remove("ac-active");
	}
	
	openResults(dat) {
		dat.map(this.addResult, this);
	}
	
	closeResults() {
		this._current = -1;
		while(this._cpl.firstChild) this._cpl.removeChild(this._cpl.firstChild);
	}
	
	/**
	 * @export
	 */
	set value(value) {
		this._input.value = value;
		this._value = value.toLowerCase();
	}
	
	/**
	 * @export
	 * @type {*} value : 
	 */
	get value() {
		let index = this._options.allData.findIndex(value => value[this._options.labelField].toLowerCase() == this._value);
		if(index != -1) return this._options.allData[index][this._options.displayField];
		return this._options.custom ? this._input.value : null;
	}
	
	/**
	 * @export
	 */
	set data(value) {
		this._options.allData = value;
		if(this._options.searchField != this._options.labelField) this._options.highlight = false;
	}

	/**
	 * @export
	 * @type {Element} input : 
	 */
	get input() {
		return this._input;
	}

	/**
	 * @export
	 * @type {Element} cpl : 
	 */
	get cpl() {
		return this._cpl;
	}
	
	/**
	 * @export
	 * @method setOptions : 
	 */
	setOptions(value) {
		this._options = {
			placeHolder: value["prompt"] || "", 
			allowOpen: value["open"] || false, 
			highlight: value["highlight"] || true, 
			custom: value["custom"] || false, 
			boxMaxHeight: value["maxHeight"] || "500px", 
			minChars: value["minChars"] || 3, 
			labelField: value["label"] || "text", 
			searchField: value["search"] || "text", 
			displayField: value["field"] || "text", 
			allData: value["data"] || [], 
			onInput: value["onInput"] || (text => {}), 
			onSelect: value["onSelect"] || ((value, item, index) => {})
		};
	}
	
}