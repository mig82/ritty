angular.module('ritty').directive('venueTab', ['RittyService', function(RittyService){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			tab: '='
		}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'directives/venue-tab.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {

			function resetToTabDefaults(){
				//The default values for a new tab.
				$scope.newTab = {
					tag: "",
					pax: 2,
				};
			}
			
			resetToTabDefaults();

			$scope.increasePax = function(){
				$scope.newTab.pax++;
			};

			$scope.decreasePax = function(){
				$scope.newTab.pax--;
			};

			//Open a new tab on the selected table.
			$scope.openTab = function(){
				RittyService.openTab($scope.newTab.tag, $scope.newTab.pax);
				resetToTabDefaults();
			};

			//Send the newly added tab items to the kitchen for preparation.
			$scope.serve = function(){
				console.log("Sending these new items for prep");
				RittyService.sendForPrep();
			};

			//Called from the tab when the user clicks the '-' button on a tab item.
			$scope.removeItemFromTab = function(tabItem){
				RittyService.removeItemFromTab(tabItem);
			};

			$scope.addAnotherToTab = function(tabItem){
				RittyService.addAnotherToTab(tabItem);
			};
		}
	};
}]);