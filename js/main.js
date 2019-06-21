window.addEventListener("load", main);

function main(event) {

	let fruitsAC = document.createElement("div");
	fruitsAC.classList.add("autocomplete");
	document.body.appendChild(fruitsAC);

	let countriesAC = document.createElement("div");
	countriesAC.classList.add("autocomplete");
	document.body.appendChild(countriesAC);
	
	let customAC = document.createElement("div");
	customAC.classList.add("autocomplete");
	document.body.appendChild(customAC);
	
	let labelAC = document.createElement("div");
	labelAC.classList.add("autocomplete");
	document.body.appendChild(labelAC);

	let fruits_data = [
		{"_id": "5c06b5ca35647b127479f560","name": "apple"},
		{"_id": "5c06b7a8d9482612c30c64a9","name": "banana"},
		{"_id": "5c06b824d9482612c30c64aa","name": "orange"},
		{"_id": "5c06b8ecd9482612c30c64ab","name": "pear"},
		{"_id": "5c08f617e179811518603bad","name": "cherry"},
		{"_id": "5c08f666e179811518603bae","name": "strawberry"},
		{"_id": "5c08f6b4e179811518603baf","name": "mango"},
		{"_id": "5c092ef2e179811518603bb6","name": "tomato"}
	];

	let countries_data = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "China - Hong Kong / Macau", "Colombia", "Comoros", "Congo", "Congo, Democratic Republic of (DRC)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "French Guiana", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Great Britain", "Greece", "Grenada", "Guadeloupe", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Israel and the Occupied Territories", "Italy", "Ivory Coast (Cote d'Ivoire)", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Korea, Democratic Republic of (North Korea)", "Korea, Republic of (South Korea)", "Kosovo", "Kuwait", "Kyrgyz Republic (Kyrgyzstan)", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia, Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Moldova, Republic of", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar/Burma", "Namibia", "Nepal", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pacific Islands", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovak Republic (Slovakia)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Netherlands", "Timor Leste", "Togo", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos Islands", "Uganda", "Ukraine", "United Arab Emirates", "United States of America (USA)", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (UK)", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
	countries_data = countries_data.map(val => ({"text": val}));

	let custom_data = ["some", "custom", "data"];
	custom_data = custom_data.map(val => ({"text": val}));
	
	let label_data = ["linguine", "lasagna", "spaghetti", "tagliatelle", "farfalle", "fusilli", "penne", "ravioli"];
	label_data = label_data.map(val => ({"text": val}));

	let fruits = new AutoComplete(fruitsAC, {
		prompt: "Fruits",
		open: true,
		highlight: true,
		data: fruits_data,
		label: "name",
		search: "name",
		field: "_id",
		minChars: 1,
		onSelect: function(value, data, index) {
			console.log("select:", value, data, index);
			console.log("fruit:", fruits.value);
		}
	});
	
	let countries = new AutoComplete(countriesAC, {
		prompt: "Countries",
		open: false,
		highlight: true,
		data: countries_data,
		minChars: 3,
		onSelect: function(value, data, index) {
			console.log("select:", value, data, index);
			console.log("country:", countries.value);
		}
	});
	
	let custom = new AutoComplete(customAC, {
		prompt: "Custom",
		open: false,
		highlight: true,
		custom: true, 
		data: custom_data,
		minChars: 3,
		onSelect: function(value, data, index) {
			console.log("select:", value, data, index);
			console.log("custom:", custom.value);
		}
	});
	
	let labeled = new AutoCompleteLabel(labelAC, {
		prompt: "Want some pasta ?",
		open: true,
		highlight: true,
		custom: true, 
		//data: label_data,
		minChars: 3,
		onSelect: function(value, data, index) {
			console.log("select:", value, data, index);
			console.log("labels:", labeled.value);
		},
		onLabel: function(label, labels, added) {
			console.log("label", label, "/", labels, added);
		}
	});
	
	labeled.data = label_data;
	
	labeled.value = label_data.slice(0, 3);
	
}