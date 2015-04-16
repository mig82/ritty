angular.module('ritty').directive('venueMenu', [function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			menu: '='
		},
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'directives/menu/venue-menu.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			//Set up the menu for the accordion.
		}
	};
}]);

angular.module('ritty').directive('venueSubmenu', ['$timeout', 'RittyService', function($timeout, RittyService){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			index: '=',
			submenu: '=',
			query: '='
		},
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		//template: '',
		templateUrl: 'directives/menu/venue-submenu.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
			
			$scope.$watch(RittyService.selectedTableHasTab, function(newValue, oldValue){
				//console.log("watch " + newValue);
				$scope.disableAddMenuItem = !newValue;
			});
		}
	};
}]);
