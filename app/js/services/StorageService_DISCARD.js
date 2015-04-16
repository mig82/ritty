angular.module('ritty').factory('StorageService', [function(){

	var ls = chrome.storage.local;
	var dbName = 'rittyDB';
	var defaultConfig;

	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/app/config/default_config.json", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {

			defaultConfig = JSON.parse(xhr.responseText);
			console.log('default config is %o', defaultConfig)
		}
	};
	xhr.send();
			
	
	return {

		init: function(callback){

			callback = callback || function () {};

			/*Initialize database*/
			ls.get(dbName, function(data) {

				/*If there is an existing database, retrieve it*/
				if ( dbName in data ) {
					console.log('Found Ritty DB, venues %o', data[dbName]);
					callback.call(this, data[dbName]);
				}
				/*If there is no existing database, create it*/
				else
				{
					data = {};
					data[dbName] = defaultConfig; //{ venues: {"a":"1", "b":"2"} };
					
					ls.set( data, function() {
						console.log('Created new Ritty DB, venues %o', data[dbName]);
						callback.call(this, data[dbName]);
					}.bind(this));
				}
			}.bind(this));

		},

		commit: function(key, value, callback){
			
			callback = callback || function () {};

			/*ls.set({key: value}, function() {
				callback.call
			}); */
		},

		fetch: function(key, callback){
			
			callback = callback || function () {};

			ls.get(dbName, function(data) {

				console.log('Fetching %s %o', key, data[dbName][key]);
				callback.call(this, data[dbName][key]);
				
			}.bind(this));

		}
	};

}])