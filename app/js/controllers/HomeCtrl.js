angular.module('ritty').controller('HomeCtrl', ['$scope',	'$location','RittyStorage','RittyService', 'RittyConfigService',   'gettextCatalog',
										function($scope, 	 $location,  RittyStorage,  RittyService,   RittyConfigService,		gettextCatalog){

	$scope.user = 'Admin';
	$scope.venue;
	$scope.tables;
	$scope.menu;
	$scope.mode = "0";
	$scope.lang = gettextCatalog.getCurrentLanguage(); //TODO: Get the venue's preferred language from storage.
	$scope.showTableControls = false;
	
	var tableControls;
	var tableUIControls;

	initScope();
	//initUI();
		
	function initScope(venues)
	{
		$scope.venue = RittyService.getSelectedVenue();
		//console.log("selected venue is %o", $scope.venue);
		
		//TODO: render all the menus in the array, not just the one at 0;
		$scope.menu = RittyService.getMenus()[0];
		$scope.tables = RittyService.getTables();

		$scope.$watch(RittyService.getSelectedTable, function(newValue, oldValue){
			$scope.table = RittyService.getSelectedTable();
		});
		//TODO: Clean up the listener on RittyService.getSelectedTable with scope.$on('$destroy', ...)
	}

	$scope.toggleMode = function(mode){
		
		if(mode)
			$scope.mode = mode;

		console.log("Editing mode %o", $scope.mode);
		switch($scope.mode){
			
			case "0": //Serve tables.
				$('#layer1, #layer2').removeClass('layer-editing');
				$('#layer1').removeClass('layer-bottom').addClass('layer-top');
				$('#layer2').removeClass('layer-top').addClass('layer-bottom');
				$('.ui-tool-bar').hide(300);
				break;
			
			case "1": //Edit table shapes, size, positioning, etc.
				$('#layer1').removeClass('layer-bottom').addClass('layer-editing layer-top');
				$('#layer2').removeClass('layer-editing layer-top').addClass('layer-bottom');
				$('.ui-tool-bar').show(300);
				break;

			case "2": //Edit the outline of the currently visible floor.
				$('#layer1').removeClass('layer-editing layer-top').addClass('layer-bottom');
				$('#layer2').removeClass('layer-bottom').addClass('layer-editing layer-top');
				$('.ui-tool-bar').hide(300);
				break;
		}
	};

	$scope.getMode = function(){
		return $scope.mode;
	};

	$scope.selectTable = function(table){
		
		RittyService.selectTable(table);

		if($scope.mode=="0"){
			$location.path('/till');
		}
	};

	$scope.switchLang = function(lang){
		$scope.lang = lang;
		gettextCatalog.setCurrentLanguage(lang);
	};

	$scope.$watch($scope.lang, function(newValue, oldValue){
		$scope.switchLang($scope.lang);
	});

	$scope.setShowTableControls = function(show){
		$scope.showTableControls = show;
	};

	$scope.getShowTableControls = function(show){
		return $scope.showTableControls;
	};

}]);


	