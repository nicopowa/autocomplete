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
	
	addLabel(label) {
		let newlabel = document.createElement("div");
		newlabel.innerHTML = label[this._options["label"]];
		this.labelsContainer.appendChild(newlabel);
		this.labels.push(label);
		this.labelEls.push(newlabel);
		newlabel.addEventListener("click", event => {
			this.removeLabel(label);
			this.focus(); // focus textfield after remove ?
		});
		this.update();
		this._options["onLabel"](label, this.labels, true);
		this.focus(); // focus textfield after add ?
	}
	
	removeLabel(label) {
		let index = this.labels.indexOf(label);
		this.labelsContainer.removeChild(this.labelEls.splice(index, 1)[0]);
		this.update();
		this._options["onLabel"](this.labels.splice(index, 1)[0], this.labels, false);
	}
	
	update() {
		this._input.style["padding-left"] = this.labelsContainer.offsetWidth + 5 + "px";
	}
	
	focus() {
		this._input.focus()
	}
	
	/**
	* @override
	*/
	select(e) {
		super.select(e);
		let index = e.target.getAttribute("data-value");
		let selected = this._data[index];
		if(this.labels.indexOf(selected) == -1) this.addLabel(selected);
		this._input.value = this._value = "";
	}
	
	onKeyDown(e) {
		super.onKeyDown(e);
		if(e.keyCode == 8 && !this._value.length && this.labels.length) { // backspace remove last label if textfield empty
			e.preventDefault();
			this._value = this._input.value = this.labels.slice(-1)[0][this._options["label"]]; // refill input
			this.removeLabel(this.labels.slice(-1)[0]);
		}
		if(e.keyCode == 13 && this._options["custom"] && this._value.length >= this._options["minChars"]) {
			if(this.labels.indexOf(this._value) == -1) {
				this.addLabel({[this._options["label"]]: this._value}); // allow custom labels on press enter
				this._input.value = this._value = "";
			}
		}
	}
	
	/**
	* @export
	*/
	get value() {
		return this.labels;
	}
	
	/**
	* @export
	*/
	set value(value) {
		while(this.labels.length) this.removeLabel(this.labels[0]);
		for(let label of value) if(this.labels.indexOf(label) == -1) this.addLabel(label);
	}
	
	/**
	* @export
	* @override
	*/
	setOptions(value) {
		super.setOptions(value);
		Object.assign(this._options, {"onLabel": function(label, labels, added) {}}, value);
	}
	
}