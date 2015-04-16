angular.module('ritty').controller('TillCtrl', ['$scope', '$location', 'RittyService', function($scope, $location, RittyService) {

	$scope.selectedTable = RittyService.getSelectedTable();
	$scope.tab = $scope.selectedTable.tab;
	$scope.menu = RittyService.getMenus()[0];

	$scope.xn = RittyService.getXN();
	setCalcScreenClass();

	$scope.$watch(RittyService.getXN, function(newValue, oldValue){
		
		if(RittyService.getXN() <= 0)
		{
			RittyService.setXN(1);
		}

		$scope.xn = RittyService.getXN();

		if($scope.xn == 1)
		{
			$scope.digits = '';
		}
	});

	$scope.gotoHome = function(){
		//TODO: RittyService.unselectTable()????;
		$location.path('/home');
	};

	//Called from the menu when the user clicks the '+' button on a menu item.
	$scope.addItemToTab = function(menuItem){
		RittyService.addItemToTab(menuItem);
		//Just to trigger the $watch so that $scope.digits will be blanked and the aid panel will re-render it.
		RittyService.setXN(0); 
	};

	//Called by the first few xN aid buttons.
	$scope.nextItemXN = function(xn){
		$scope.xn = xn

		if(xn > 1)
		$scope.digits = xn.toString();
		else if(xn == 1)
		$scope.digits = '';
		else
		console.error("Next item can't be x less than 1.");
		
		RittyService.setXN(xn);
		console.log("Next item x%s", $scope.xn);
		setCalcScreenClass();
	};

	//Called by the additional xN aid buttons.
	$scope.enterDigit = function(digit){

		//Do not accept leading zero's.
		if(digit != '0' || $scope.digits.length != 0)
		{
			$scope.digits =  $scope.digits.concat(digit);
		
			$scope.xn = parseInt($scope.digits);
			RittyService.setXN($scope.xn);
			setCalcScreenClass();
		}
	};

	//Called by the 'clear' button from the aid buttons.
	$scope.deleteDigit = function(){
		
		if($scope.digits.length > 0)
		{
			$scope.digits = $scope.digits.substring(0, $scope.digits.length-1);

			if($scope.digits.length > 0)
			{
				$scope.xn = parseInt($scope.digits);
				RittyService.setXN($scope.xn);
			}
		}
		setCalcScreenClass();
	};

	function setCalcScreenClass(){
		if ($scope.xn <= 2)
		$scope.calcScreenClass = ["alert", "alert-info", "calc-screen"];
		else if ($scope.xn <= 6)
		$scope.calcScreenClass = ["alert", "alert-success", "calc-screen"];
		else if ($scope.xn <= 12)
		$scope.calcScreenClass = ["alert", "alert-warning", "calc-screen"];
		else
		$scope.calcScreenClass = ["alert", "alert-danger", "calc-screen"];
	}

}]);