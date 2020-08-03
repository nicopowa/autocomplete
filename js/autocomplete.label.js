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
	
	constructor(el, options) {
		super(el, options);

		this.labels = [];
		this.labelEls = [];
		
		this.labelsContainer = document.createElement("div");
		this.labelsContainer.classList.add("ac-labels");
		this._element.appendChild(this.labelsContainer);
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
		this.update();
		if(dispatch) this._options.onLabel(label, this.labels, true);
		this.focus(); // focus textfield after add ?
	}
	
	removeLabel(label, dispatch = true) {
		//console.log("remove", label);
		let index = this.findIndex(label[this._options.labelField]);
		this.labelsContainer.removeChild(this.labelEls.splice(index, 1)[0]);
		let removed = this.labels.splice(index, 1)[0];
		this.update();
		if(dispatch) this._options.onLabel(removed, this.labels, false);
	}
	
	update() {
		this._input.style["padding-left"] = this.labelsContainer.offsetWidth + 5 + "px";
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
	 * @export
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