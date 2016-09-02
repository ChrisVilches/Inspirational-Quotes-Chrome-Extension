var db = null;
var DBNAME = "quotes_db";
var DBVER = 1;


// http://tipstak.blogspot.cl/2014/02/indexeddb-crud-example.html

// open a database
function openDB() {
	var request = indexedDB.open(DBNAME, DBVER);

	request.onupgradeneeded = function (e) {
		console.log("Upgrading...");
		var thisDB = e.target.result;
		var store = null;
		if (!thisDB.objectStoreNames.contains("quote")) {

			store = thisDB.createObjectStore("quote", {
				keyPath: "timestamp"
			});
		}
	};

	request.onsuccess = function (e) {
		console.log("openDB success!");
		db = e.target.result;
	};

	request.onerror = function (e) {
		console.log("openDB error");
	};
}


// Find by key
function findByKey(key, callback) {
	var tx = db.transaction(["quote"], "readonly");
	var store = tx.objectStore("quote");
	var request = store.get(key);

	request.onsuccess = function (e) {
		callback(e.target.result);
	};
}



// Find all rows
function findAll(callback){
	var tx = db.transaction(["quote"], "readonly");
	var objectStore = tx.objectStore("quote");
	var cursor = objectStore.openCursor();

	var result = [];

	cursor.onsuccess = function (e) {
		var res = e.target.result;
		if (res) {
			result.push(res.value);
			res.continue();
		} else {
			callback(result);
		}
	};
}


// Delete one
function removeByKey(key, callback) {
	var tx = db.transaction(["quote"], "readwrite");
	var store = tx.objectStore("quote");

	var request = store.delete(key);

	request.onsuccess = function (e) {
		callback(true);
	};

	request.onerror = function (e) {
		callback(false);
	};
}



// add data
function add(o, callback) {
	var tx = db.transaction(["quote"], "readwrite");
	var store = tx.objectStore("quote");

	if(callback == null) callback = function(a){ /* nothing */ };

	if(o.quote_content == null || o.quote_content == "" || o.quote_content == undefined || o.quote_content.length == 0){
		callback("Quote can't be empty.");
		return;
	}

	// add 'created' param
	o.created = new Date();

	// add to store
	var request = store.add(o);

	request.onsuccess = function (e) {
		console.log("Add 'quote' successful! quote=" + JSON.stringify(o));
		callback(false);
	};

	request.onerror = function (e) {
		console.log("Add error", e.target.error.name);
		callback(e.target.error.name);
	};
}



function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getTotalQuotes(callback){

	var store = db.transaction(["quote"],"readonly").objectStore("quote");

	store.count().onsuccess = function(event) {
		callback(event.target.result);
	}
}

// Show random quote
function showRandomQuote(callback){

	var store = db.transaction(["quote"],"readonly").objectStore("quote");

	store.count().onsuccess = function(event) {
		var total = event.target.result;

		if(total == 0){
			callback(null);
			console.log("Empty DB!");
			return;
		}

		var needRandom = true;
		console.log("ok, total is "+total);
		store.openCursor().onsuccess = function(e) {
			var cursor = e.target.result;
			if(needRandom) {
				var advance = getRandomInt(0, total-1);
				console.log("going up "+advance);
				if(advance > 0) {
					needRandom = false;
					cursor.advance(advance);	
				} else {
					callback(cursor.value);
				}
			} else {
				callback(cursor.value);
			}
		};
	};
}
