angular.module('ritty').factory('IndexedDBService', [function(){
	
	'use strict'

	var dbName = "rittyDB";
	var dbVersion = 1.0;
	var rittyDB = {};
	var indexedDB = window.indexedDB || 
					window.webkitIndexedDB || 
					window.mozIndexedDB;
	
	rittyDB.indexedDB = {};
	rittyDB.indexedDB.db = null;
	
	var foo = 'bar';

	if (window.webkitIndexedDB && !window.indexedDB) {
		 window.IDBTransaction = window.webkitIDBTransaction;
		 window.IDBKeyRange = window.webkitIDBKeyRange;
	}
	
	//call this from somewhere to init.
	//rittyDB.indexedDB.open();

	rittyDB.indexedDB.open = function(callback)
	{
		var request = indexedDB.open(dbName, dbVersion);

		request.onupgradeneeded = function(e)
		{
			// The database did not previously exist, so create object stores and indexes.
			console.log ("Upgrading Ritty DB");

			//var db = request.result;
			rittyDB.indexedDB.db = e.target.result;
			var db = rittyDB.indexedDB.db;

			if(db.objectStoreNames.contains("venues")) {
				db.deleteObjectStore("venues");
			}
			
			var store = db.createObjectStore("venues",{ keyPath: "id"});
			//rittyDB.indexedDB.getAllTodoItems();

			// Populate with initial data.
			store.put({
				"id": "v1",
				"name": "Deluxe Grill",
				"tables" : {
					"1": {"id": "1", "shape":"ellipse", "x":0,		"y":0,  	"w":50,	"h":50,	"rotation":0.00, "tag": "pepe"},
					"2": {"id": "2", "shape":"ellipse", "x":300,	"y":50,  	"w":50,	"h":50,	"rotation":0.00, "tag": "mario"},
					"3": {"id": "3", "shape":"ellipse", "x":10,		"y":200, 	"w":50,	"h":50,	"rotation":0.00, "tag": "pepe"}},
				"menu" : {
					"title": "Dinner Menu",
					"desc": "Some of the finest creations of our chef with a...",
					"submenus": [
						{
							"title" : "Main Courses",
							"desc": "Our main courses offer a variety of...",
							"items": [
								{"name": "Lamb chops", 			"desc": "Delicious lamb chops with...",	"price": 15.00, 	"minpax": 2, "callories": 1200, "eta": 10,	"tags": ["very spicy", "chefs specialty"]},
								{"name": "Grilled salmon",		"desc": "Delicious griled salmon",		"price": 18.00, 	"minpax": 1, "callories": 1000, "eta": 10,	"tags": ["chefs specialty"]},
								{"name": "Cucumber carpaccio", 	"desc": "Raw cucumber with parmessan",	"price": 12.00, 	"minpax": 1, "callories": 300, 	"eta": 7,	"tags": ["vegetarian"]},
								{"name": "Mahalo Lobster", 		"desc": "Hawaian style lobster",			"price": "market",	"minpax": 2, "callories": 2000,	"eta": 15,	"tags": ["from the sea", "chefs specialty"]}
							]
						} 
					]
				}
			});
		};

		request.onsuccess = function(e)
		{
			rittyDB.indexedDB.db = e.target.result;
			var db = rittyDB.indexedDB.db;
			
			console.log ("Found DB %s version %s: %o", dbName, dbVersion, db);
			callback.call(this, db);
		};

		request.onerror = function(e) {
			console.error("Error opening DB %s version %s: %o", dbName, dbVersion, e);
		};
	};

	rittyDB.indexedDB.getVenues = function() 
	{
		console.log("foo is %s", foo);
		var db = rittyDB.indexedDB.db;

		console.log("will query venues from %o", db);
		/*var tx = db.transaction(["venues"], "readwrite");
		var store = tx.objectStore("venues");

		// Get everything in the store;
		var keyRange = IDBKeyRange.lowerBound(0);
		var cursorRequest = store.openCursor(keyRange);

		console.log("getting venues2...");
		cursorRequest.onsuccess = function(e) {
			
			var result = e.target.result;
			console.log("Success retrieving venues: %o", result);
			
			
			if(!!result == false) return;

			//renderTodo(result.value);
			result.continue();
		};

		cursorRequest.onerror = function(e) {
			console.error("Error querying venues: %o", e);
		};*/
	};

	/*
	rittyDB.indexedDB.addTabItem = function(item) {
		var db = rittyDB.indexedDB.db;
		var trans = db.transaction(['todo'], "readwrite");
		var store = trans.objectStore("todo");

		var data = {
		"text": item,
		"timeStamp": new Date().getTime()
		};
		var request = store.put(data);

		request.onsuccess = function(e) {
			rittyDB.indexedDB.getAllTodoItems();
		};

		request.onerror = function(e) {
			console.error("Error Adding an item: ", e);
		};
	};

	rittyDB.indexedDB.deleteTodo = function(id) {
		var db = rittyDB.indexedDB.db;
		var trans = db.transaction(["todo"], "readwrite");
		var store = trans.objectStore("todo");
		var request = store.delete(id);
		request.onsuccess = function(e) {
		rittyDB.indexedDB.getAllTodoItems();
		};
		request.onerror = function(e) {
		console.error("Error deleteing: ", e);
		};
	};

	rittyDB.indexedDB.getAllTodoItems = function()
	{
		var todos = document.getElementById("todoItems");
		todos.innerHTML = "";
		var db = rittyDB.indexedDB.db;
		var trans = db.transaction(["todo"], "readwrite");
		var store = trans.objectStore("todo");

		// Get everything in the store;
		var keyRange = IDBKeyRange.lowerBound(0);
		var cursorRequest = store.openCursor(keyRange);

		cursorRequest.onsuccess = function(e) {
			var result = e.target.result;
			if(!!result == false)
				return;

			renderTodo(result.value);
			result.continue();
		};
		cursorRequest.onerror = rittyDB.indexedDB.onerror;
	};

	function renderTodo(row) {
		var todos = document.getElementById("todoItems");
		var li = document.createElement("li");
		var a = document.createElement("a");
		var t = document.createTextNode(row.text);

		a.addEventListener("click", function() {
		rittyDB.indexedDB.deleteTodo(row.timeStamp);
		}, false);

		// some fun with jquery mobile data attributes
		a.setAttribute("href", "#");
		a.setAttribute("data-iconpos", "notext");
		a.setAttribute("data-role", "button");
		a.setAttribute("data-icon", "delete"); 
		a.setAttribute("data-inline", "true");
		
		li.appendChild(a);
		li.appendChild(t);
		todos.appendChild(li)
		// And lets create the new il item with its markup
		$("#todoItems").trigger('create'); 
	}*/

	return{

		init: function(callback){
			rittyDB.indexedDB.open(callback);
		},

		getVenues: function(callback){
			console.log("getting venues1...");
			
		} 
		/*
		* {item} a String.
		*/
		/*addTabItem: function(item){
			if (todo.length > 0) {
				rittyDB.indexedDB.addTabItem(item);
			}
		}*/
	};
}])