/**
 * @export
 * @nocollapse
 * @class AutoComplete : simple autocomplete / based on https://www.w3schools.com/howto/howto_js_autocomplete.asp
 * @url https://nicopr.fr/autocomplete
 */
class AutoComplete {
	
	/**
	 * @construct
	 * @param {Element} el : autocomplete container
	 * @param {Object} options : 
	 */
	constructor(el, options) {
		this._options = this.setOptions(options);
		
		this._element = el;
		this._value = "";
		this._current = -1;
		this._down = false;
		
		this._element.classList.add("ac");
		
		this._input = document.createElement("input");
		this._input.setAttribute("type", "search");
		if(this._options.required) this._input.setAttribute("required", "");
		if(!this._options.filter) this._input.setAttribute("data-readonly", "");
		this._input.setAttribute("placeholder", this._options.placeHolder);
		this._element.appendChild(this._input);

		if(this._options.value) this.value = this._options.value;
		
		this._cpl = document.createElement("div");
		this._cpl.style.maxHeight = this._options.boxMaxHeight;
		this._cpl.classList.add("ac-items");
		this._element.appendChild(this._cpl);
		
		let events = {"input": this.onInput, "click": this.onClick, "keydown": this.onKeyDown, "blur": this.onBlur};
		for(let event in events) this._input.addEventListener(event, events[event].bind(this));
	
		this._cpl.addEventListener("mousedown", this.onMouseDown.bind(this));
	}
	
	/**
	 * @method onInput : textfield input
	 * @param {Event} event : 
	 */
	onInput(event) {
		this._value = this._input.value.toLowerCase();
		this.closeResults();
		if(!this._options.allowOpen && (this._value.length < this._options.minChars || this._cpl.childElementCount)) return;
		this.openResults(this.filter());
		this._options.onInput(this._value);
	}
	
	/**
	 * @private
	 * @method addResult : 
	 * @param {Object} result : 
	 */
	addResult(result) {
		let b = document.createElement("div");
		if(this._options.highlight) b.innerHTML = this.highlight(result[this._options.labelField]);
		else b.innerHTML = result[this._options.labelField];
		b.setAttribute("data-value", this._options.allData.findIndex(value => value[this._options.labelField] == result[this._options.labelField]));
		b.addEventListener("click", this.select.bind(this));
		this._cpl.appendChild(b);
	}
	
	/**
	 * @private
	 * @method filter : 
	 */
	filter() {
		return this._options.allData.filter(value => value[this._options.searchField].toLowerCase().indexOf(this._value) != -1 || !this._options.filter);
	}
	
	/**
	 * @private
	 * @method highlight : 
	 */
	highlight(label) {
		let found = label.toLowerCase().indexOf(this._value), 
		high = document.createElement("span");
		high.innerHTML = label.slice(found, found + this._value.length);
		return label.slice(0, found) + high.outerHTML + label.slice(found + this._value.length, label.length);
	}
	
	/**
	 * @method select : 
	 * @param {Event} event : 
	 */
	select(event) {
		let index = event.target.getAttribute("data-value"), // SPAN HIGHLIGHT ERROR ??
			selected = this._options.allData[index];
		this._input.value = selected[this._options.labelField];
		this._value = this._input.value.toLowerCase();
		this._down = false;
		this.closeResults();
		this._options.onSelect(selected[this._options.displayField], selected, index);
	}
	
	/**
	 * @method onClick : 
	 * @param {Event} event : 
	 */
	onClick(event) {
		if(this._cpl.childElementCount) return this.closeResults();
		if(this._options.allowOpen && !this._value) this.openResults(this._options.allData);
		else this.onInput(null);
	}
	
	/**
	 * @method onKeyDown : 
	 * @param {Event} event : 
	 */
	onKeyDown(event) {
		let x = this._cpl.childNodes;
		if([40, 38, 13, 27].indexOf(event.keyCode) != -1 || !this._options.filter) event.preventDefault();
		switch(event.keyCode) {
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
	
	/**
	 * @method onBlur : 
	 * @param {Event} event : 
	 */
	onBlur(event) {
		if(this._down) return;
		this.closeResults();
	}
	
	/**
	 * @method onMouseDown : 
	 * @param {Event} event : 
	 */
	onMouseDown(event) {
		this._down = true;
	}
	
	/**
	 * @method activeResult : 
	 * @param {*} x : 
	 */
	activeResult(x) {
		if(!x.length) return;
		this.inactiveResult(x);
		this._current = this._current < 0 ? x.length - 1 : (this._current > x.length - 1 ? 0 : this._current);
		x[this._current].classList.add("ac-active");
		x[this._current].scrollIntoView();
	}
	
	/**
	 * @method inactiveResult : 
	 * @param {*} x : 
	 */
	inactiveResult(x) {
		for(let i = 0, l = x.length; i < l; i++) x[i].classList.remove("ac-active");
	}
	
	/**
	 * @method openResults : 
	 * @param {Array<Object>} dat : 
	 */
	openResults(dat) {
		dat.map(this.addResult, this);
	}
	
	/**
	 * @method closeResults : 
	 */
	closeResults() {
		this._current = -1;
		while(this._cpl.firstChild) this._cpl.removeChild(this._cpl.firstChild);
	}
	
	/**
	 * @setter
	 */
	set value(value) {
		if(!this._options.custom) {
			let index = this._options.allData.findIndex(val => val[this._options.displayField] === value);
			if(index != -1) value = this._options.allData[index][this._options.labelField];			
		}
		this._input.value = value;
		this._value = value.toLowerCase();
	}
	
	/**
	 * @export
	 * @getter
	 * @type {String} value : 
	 */
	get value() {
		let index = this._options.allData.findIndex(value => value[this._options.labelField].toLowerCase() == this._value);
		if(index != -1) return this._options.allData[index][this._options.displayField];
		return this._options.custom ? this._input.value : null;
	}
	
	/**
	 * @setter
	 */
	set data(value) {
		this._options.allData = value;
		if(this._options.searchField != this._options.labelField) this._options.highlight = false;
	}

	/**
	 * @export
	 * @getter
	 * @type {Element} input : 
	 */
	get input() {
		return this._input;
	}

	/**
	 * @export
	 * @getter
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
		return {
			value: value["value"] || "", 
			filter: value["filter"] !== false, 
			required: value["required"] || false, 
			placeHolder: value["prompt"] || "", 
			allowOpen: value["open"] || false, 
			highlight: value["highlight"] !== false && value["filter"], 
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

/**
 * simple autocomplete with multi select
 * https://nicopr.fr/autocomplete
 */

/**
 * @nocollapse
 * @export
 * @extends {AutoComplete}
 */
class AutoCompleteLabel extends AutoComplete {
	
	/**
	 * @construct
	 * @param {Element} el : autocomplete container
	 * @param {Object} options : 
	 */
	constructor(el, options) {
		super(el, options);

		this._element.classList.add("ac-label");

		this.labels = [];
		this.labelEls = [];
		
		this.labelsContainer = document.createElement("div");
		this.labelsContainer.classList.add("ac-labels");
		this._element.insertBefore(this.labelsContainer, this._input);
	}
	
	addLabel(label, dispatch = true) {
		//console.log("add", label);
		let newlabel = document.createElement("div");
		newlabel.innerHTML = label[this._options.labelField];
		this.labelsContainer.appendChild(newlabel);
		this.labels.push(label);
		this.labelEls.push(newlabel);
		newlabel.addEventListener("click", event => {
			this.removeLabel(label);
			this.focus(); // focus textfield after remove ?
		});
		if(dispatch) this._options.onLabel(label, this.labels, true);
		this.focus(); // focus textfield after add ?
	}
	
	removeLabel(label, dispatch = true) {
		//console.log("remove", label);
		let index = this.findIndex(label[this._options.labelField]);
		this.labelsContainer.removeChild(this.labelEls.splice(index, 1)[0]);
		let removed = this.labels.splice(index, 1)[0];
		if(dispatch) this._options.onLabel(removed, this.labels, false);
	}
	
	focus() {
		this._input.focus();
	}
	
	/**
	 * @override
	 */
	select(e) {
		super.select(e);
		let index = e.target.getAttribute("data-value");
		let selected = this._options.allData[index];
		index = this.findIndex(selected[this._options.labelField]);
		if(index == -1) this.addLabel(selected);
		this._input.value = this._value = "";
	}
	
	onKeyDown(e) {
		super.onKeyDown(e);
		if(e.keyCode == 8 && !this._value.length && this.labels.length) { // backspace remove last label if textfield empty
			e.preventDefault();
			this._value = this._input.value = this.labels.slice(-1)[0][this._options.labelField]; // refill input
			this.removeLabel(this.labels.slice(-1)[0]);
		}
		if(e.keyCode == 13 && this._options.custom && this._value.length >= this._options.minChars) {
			let index = this.findIndex(this._value);
			if(index == -1) {
				this.addLabel({[this._options.labelField]: this._value}); // allow custom labels on press enter
				this._input.value = this._value = "";
			}
		}
	}

	findIndex(label) {
		let index = this.labels.findIndex(val => val[this._options.labelField].toLowerCase() == label.toLowerCase());
		//console.log("found", index);
		return index;
	}
	
	/**
	 * @export
	 * @getter
	 * @type {Array} value : 
	 */
	get value() {
		return this.labels;
	}
	
	/**
	 * @setter
	 */
	set value(value) {
		while(this.labels.length) this.removeLabel(this.labels[0], false);
		//this.labels.forEach(label => this.removeLabel(label, false));
		if(typeof value[0] === "string") value = value.map(val => ({[this._options.labelField]: val}));
		value.filter(label => this.findIndex(label[this._options.labelField]) == -1).forEach(label => this.addLabel(label, false));
	}
	
	/**
	 * @export
	 * @override
	 * @method setOptions : 
	 */
	setOptions(value) {
		return {
			...super.setOptions(value), 
			...{ 
				onLabel: value["onLabel"] || ((label, labels, added) => {})
			}
		};
	}
	
}