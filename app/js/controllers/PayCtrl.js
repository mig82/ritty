angular.module('ritty').controller('PayCtrl', ['$scope', '$location', 'RittyService', function($scope, $location, RittyService) {

	$scope.tab = RittyService.getSelectedTable().tab;
	$scope.partyCount = 2; 
	
	$scope.sortableOptions = {
		//'ui-floating': true
		connectWith: ".connected-tab-list",
		stop: function() {
			$scope.tab.syncTotals();
			console.log("tab: %o" , $scope.tab );
		},
	};

	$scope.createSubTab = function(){
		$scope.tab.createSubTab();
		$scope.partyCount = $scope.tab.subTabs.length;
		//$scope.connectLists = true;
	};

	$scope.increaseNumOfSubtabs = function(){
		$scope.partyCount++;
	};

	$scope.decreaseNumOfSubtabs = function(){
		$scope.partyCount = Math.max( 2, $scope.partyCount-1, $scope.tab.subTabs?$scope.tab.subTabs.length:0 );
	};

	$scope.splitEven = function(){
		for (var i = $scope.tab.subTabs?$scope.tab.subTabs.length:1; i < $scope.partyCount; i++) {
			$scope.tab.createSubTab();
		};
		$scope.tab.splitEven();
	};

}]);