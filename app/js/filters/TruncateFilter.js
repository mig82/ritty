angular.module('ritty').filter('truncate', function() {
	return function(text, length) {

		if(!text || text.length == 0)
		return "";

		if(!length)
		length = 10;
		
		return text.substr(0, length-1) ;
	};
});