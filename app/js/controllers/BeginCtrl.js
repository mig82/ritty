angular.module('ritty').controller('BeginCtrl', ['$scope',	'$location','RittyStorage','RittyService', 'RittyConfigService',
										function($scope, 	 $location,  RittyStorage,  RittyService,   RittyConfigService){

	$scope.user = 'Admin';
	$scope.venue;
	$scope.venueIndex = 0;
	$scope.venues = [];

	/*	1. Allways load default options from config file.
	*	Some may have already been persisted if previously selected. */
	RittyConfigService.loadDefaultVenueOptions().then(function(venues){
		initScope(venues);
	});

	function initScope(venues)
	{
		console.log("step 1: Load default Venue options");
		RittyService.setVenues(venues);
		$scope.venues = venues;
		$scope.venue = RittyService.getSelectedVenue();
		$scope.$apply();
	}

	$scope.gotoVenue = function(){
		
		/*	2. Retrieve what venue has been selected and pass it to the Service so it can be broadcasted. */
		$scope.venue = $scope.venues[$scope.venueIndex];
		RittyService.selectVenue($scope.venue);
		console.log("step 2: Retrieve data on selected Venue from storage.");

		/*	3. Attempt to retrieve data for selected venue from storage.
		*	If it does not exist, this will return undefined*/

		Q(RittyStorage.getVenue($scope.venue.id)).then(
			function(venue){
				console.log("Venue found in storage: %o. Skipping step 3", venue);
			},
			function(error){
				console.log("Venue not found %o. Will load from default config.", error);
				return RittyConfigService.loadDefaultVenue($scope.venue.id).then(function(stores){
					console.log("step 3: Load from default config and commit to storage.");
					return Q.allSettled([
						RittyStorage.populateStore('venues', [$scope.venue]),
						RittyStorage.populateStore('tables', stores['tables']),
						RittyStorage.populateStore('menus', stores['menus'])
					]);
				});
			}
		).then(function(){
				/*	7. Load each of the previously persisted stores from storage and pass them to RittyService for broadcasting. */
			console.log("step 4: Load venue data from storage.");
			return Q.allSettled([
				RittyStorage.getVenue($scope.venue.id).then(function(venue){
				RittyService.selectVenue(venue)}),

				RittyStorage.getTables($scope.venue.id).then(function(tables){
				RittyService.setTables(tables)}),

				RittyStorage.getMenus($scope.venue.id).then(function(menus){
				RittyService.setMenus(menus)})
			]);
		}).then(function(){
			/*	8. Navigate to home page once all stores are registered with RittyService. */
			console.log("step 5");
			$location.path('/home');
		}).fail(function(reason){
			console.error("Error: %o", reason);
		});
		
		
	};

	$scope.gotoSandBox = function(){
		$location.path('/test');
	};

}]);


	