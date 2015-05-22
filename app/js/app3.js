
var app = angular.module('ritty', ['ngRoute', 'ngTouch', 'indexedDB', 'mgcrea.ngStrap', 'gettext', 'ui.sortable'])

.config(['$routeProvider', '$indexedDBProvider', function($routeProvider, $indexedDBProvider) {
	
	"use strict";

	$indexedDBProvider.connection('rittyDB')
		.upgradeDatabase(1, function(event, db, tx){
			var venueStore = db.createObjectStore('venues', {keyPath: 'id'});
			
			var tableStore = db.createObjectStore('tables', {keyPath: 'id'});
			tableStore.createIndex('venue_id', 'venue_id', {unique: false});
			
			var menuStore = db.createObjectStore('menus', {keyPath: 'id'});
			menuStore.createIndex('venue_id', 'venue_id', {unique: false});

			//db.deleteObjectStore('menus');
		});

	$routeProvider.when('/begin', {
		templateUrl: 'views/begin.html',
		//controller: "BeginController"
	});

	$routeProvider.when('/home', {
		templateUrl: 'views/home.html',
		//controller: "HomeController"
	});

	$routeProvider.when('/till', {
		templateUrl: 'views/till.html',
		//controller: "HomeController"
	});

	$routeProvider.when('/test', {
		templateUrl: 'views/test.html'
		
	});

	$routeProvider.otherwise({ redirectTo: '/begin' });

}])

.run(function(gettextCatalog){
	
	console.log('Starting Ritty...');

	gettextCatalog.setCurrentLanguage('en');
	gettextCatalog.debug = true;
});
