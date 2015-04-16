angular.module('ritty').factory('RittyConfigService', [function(){
	
	var _loadDefaultVenueOptions = function(){

		return _loadDefaultConfig("/app/config/default_config_venues.json").then(function(data){
			return data['venues'];
		});
	};

	var _loadDefaultVenue = function(venueId){

		var fileName = "/app/config/default_config_"+ venueId +".json";
		console.log("will attempt to load data from '%s'", fileName);
		return _loadDefaultConfig(fileName);
	};

	var _loadDefaultConfig = function(fileName){

		return new Promise(function(resolve, reject)
		{
			// do a thing, possibly async, then…
			var defaultConfig;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", fileName, true);

			//xhr.onreadystatechange = function() {
			xhr.onload = function() {
				//if (xhr.readyState == 4) {
				if (xhr.status == 200) {

					defaultConfig = JSON.parse(xhr.responseText);
					console.info('default config is %o', defaultConfig);
					resolve(defaultConfig);
				}
				else{
					console.error("Error loading default data");
					reject(Error(xhr.statusText));
				}
			};

			// Handle network errors
			xhr.onerror = function() {
				reject(Error("Network Error"));
			};

			xhr.send();

		});
	};

	return {
		loadDefaultVenueOptions: _loadDefaultVenueOptions,
		loadDefaultVenue: _loadDefaultVenue
	};
}])