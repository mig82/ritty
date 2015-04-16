angular.module('ritty').filter('tabId', function() {
	return function(tabId) {

		if(!tabId || tabId.length == 0)
		return "No identifier";

		var i = tabId.indexOf("-");

		if(i < 0 || i == tabId.length-1)
		return tabId;

		return tabId.split("-")[1] ;
	};
});