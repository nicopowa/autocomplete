/**
* simple autocomplete
* https://nicopr.fr/autocomplete
* based on https://www.w3schools.com/howto/howto_js_autocomplete.asp
*/

/**
* @nocollapse
* @export
*/
class AutoComplete {
	
	constructor(el, options) {
		this.opt = {};
		this.options = options;
		this.dat = [];
		this.data = this.opt["data"];
		this.el = el;
		this.val = "";
		this.ct = -1;
		this.down = false;
		
		this.empty(this.el);
		
		this.inp = document.createElement("input");
		this.inp.setAttribute("class", "ac-input");
		this.inp.setAttribute("placeHolder", this.opt["placeHolder"]);
		this.el.appendChild(this.inp);
		
		[["input", this.onInput], ["click", this.onClick], ["keydown", this.onKeyDown], ["blur", this.onBlur]].map(value => this.inp.addEventListener(value[0], value[1].bind(this)));
		
		this.cpl = document.createElement("div");
		this.cpl.style.maxHeight = this.opt["maxHeight"] + "px";
		this.cpl.setAttribute("class", "ac-items");
		this.el.appendChild(this.cpl);
		this.cpl.addEventListener("mousedown", this.onMouseDown.bind(this));
	}
	
	onInput(e) {
		this.val = this.inp.value.toLowerCase();
		this.close();
		if(this.opt["open"] === false && (this.val.length < this.opt["minChars"] || this.cpl.childElementCount)) return;
		this.filter().map(this.addResult, this);
	}
	
	addResult(result) {
		let b = document.createElement("div");
		if(this.opt["highlight"]) {
			let found = result[this.opt["labelField"]].toLowerCase().indexOf(this.val);
			b.innerHTML = result[this.opt["labelField"]].slice(0, found) + "<strong><font color=\"#FF9400\">" + result[this.opt["labelField"]].slice(found, found + this.val.length) + "</font></strong>" + result[this.opt["labelField"]].slice(found + this.val.length, result[this.opt["labelField"]].length);
		}
		else b.innerHTML = result[this.opt["labelField"]];
		b.setAttribute("data-value", this.dat.findIndex(value => value[this.opt["labelField"]] == result[this.opt["labelField"]]));
		b.addEventListener("click", this.select.bind(this));
		this.cpl.appendChild(b);
	}
	
	filter() {
		return this.dat.filter(value => value[this.opt["searchField"]].toLowerCase().indexOf(this.val) != -1);
	}
	
	select(e) {
		let selected = this.dat[e.target.getAttribute("data-value")];
		this.inp.value = selected[this.opt["labelField"]];
		this.val = this.inp.value.toLowerCase();
		this.opt["onSelect"](selected[this.opt["dataField"]]);
		this.down = false;
		this.close();
	}
	
	onClick(e) {
		this.close();
		if(this.opt["open"] === true && this.val == "") this.dat.map(this.addResult, this);
		else this.onInput(null);
	}
	
	onKeyDown(e) {
		let x = this.cpl.childNodes;
		if([40, 38, 13, 27].indexOf(e.keyCode) != -1) e.preventDefault();
		if(e.keyCode == 40) { // down
			if(this.ct == -1) this.onInput(null);
			this.ct++;
			this.active(x);
		}
		else if(e.keyCode == 38) { // up
			this.ct--;
			this.active(x);
		}
		else if(e.keyCode == 13) { // enter
			if(this.ct != -1) x[this.ct].click();
			else this.close();
		}
		else if(e.keyCode == 27) this.close(); // esc
	}
	
	onBlur(e) {
		if(this.down) return;
		this.close();
	}
	
	onMouseDown(event) {
		this.down = true;
	}
	
	active(x) {
		if(!x.length) return;
		this.inactive(x);
		this.ct = this.ct < 0 ? x.length - 1 : (this.ct > x.length - 1 ? 0 : this.ct);
		x[this.ct].classList.add("ac-active");
		x[this.ct].scrollIntoView();
	}
	
	inactive(x) {
		for(let i = 0, l = x.length; i < l; i++) x[i].classList.remove("ac-active");
	}
	
	close() {
		this.ct = -1;
		this.empty(this.cpl);
	}
	
	empty(el) {
		while(el.firstChild) el.removeChild(el.firstChild);
	}
	
	/**
	* @export
	*/
	set value(value) {
		this.inp.value = value;
		this.val = value.toLowerCase();
	}
	
	/**
	* @export
	*/
	get value() {
		let index = this.dat.findIndex(value => value[this.opt["labelField"]].toLowerCase() == this.val);
		if(index != -1) return this.dat[index][this.opt["dataField"]];
		return null;
	}
	
	/**
	* @export
	*/
	get input() {
		return this.inp;
	}
	
	/**
	* @export
	*/
	get box() {
		return this.cpl;
	}
	
	/**
	* @export
	*/
	set data(value) {
		if(this.opt["searchField"] == "") {
			this.dat = value.map(val => ({"text": val}));
			this.opt["labelField"] = this.opt["searchField"] = this.opt["dataField"] = "text";
		}
		else this.dat = value;
		if(this.opt["searchField"] != this.opt["labelField"]) this.opt["highlight"] = false;
	}
	
	/**
	* @export
	*/
	get data() {
		return this.dat;
	}
	
	/**
	* @export
	*/
	set options(value) {
		Object.assign(this.opt, {"placeHolder": "", "open": false, "highlight": true, "maxHeight": 500, "minChars": 3, "labelField": "", "searchField": "", "dataField": "", "data": [], "onSelect": function() {}}, value);
	}
}