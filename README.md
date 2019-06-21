
# AutoComplete

https://nicopr.fr/autocomplete

based on https://www.w3schools.com/howto/howto_js_autocomplete.asp

Tiny autocomplete and label class

# Features

 - no dependencies
 - autocomplete base : 3.37k JS / 1.7k GZIP / 1k CSS
 - autocomplete label : 5.63k JS / 2.5k GZIP / 1k CSS
 - filter array of Objects
 - full mouse / keyboard interaction
 - highlight search results
 - TODO : remote search

# Options


|name|type|feature|
|--|--|--|
|prompt|string|input place holder|
|open|boolean|open on click
|highlight|boolean|highlight text on matched entries
|custom|boolean|allow custom text
|maxHeight|string|result popup maximum height
|minChars|int|minimum input length to perform search
|label|string|display field
|search|string|search field
|field|string|data field
|onInput|function(text)|dispatched on input change
|onSelect|function(value, item, index)|dispatched on selection

# Example
	
    let myDataProvider = let fruits_data = [
		{"_id": "5c06b5ca35647b127479f560","name": "apple"},
		{"_id": "5c06b7a8d9482612c30c64a9","name": "banana"},
		{"_id": "5c06b824d9482612c30c64aa","name": "orange"},
		{"_id": "5c06b8ecd9482612c30c64ab","name": "pear"}
	];
	
	let myElement = document.createElement("div");
	
	let fruits_autocomplete = new AutoComplete(myDataProvider, {
		prompt: "Fruits", // placeHolder
		open: true, // open on click
		highlight: true, // highlight search results
		data: fruits_data, // data
		label: "name", // display field
		search: "name", // search field
		field: "_id", // data field
		minChars: 1, // before exec search
		onSelect: function(value, data, index) { // select callback
			console.log("select:", value, data, index);
			console.log("fruit:", fruits_autocomplete.value);
		}
	});	
