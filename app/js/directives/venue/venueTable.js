angular.module('ritty').directive('venueTable', ['$timeout', 'RittyService', 'RittyStorage', function($timeout, RittyService, RittyStorage){
	// Runs during compile

	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope:{
			table: '=',
			x: '@',
			y: '@',
			h: '@',
			w: '@',
			rotation: '@',
			shape: '@',
			selectTableFn: '&',
			getModeFn: '&',
			getShowTableControlsFn: '&'
		},
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		restrict: 'E',
		// template: '',
		templateUrl: 'directives/venue-table.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {

			var shapes = ['rect', 'ellipse'];
			var shapeIndex = shapes.indexOf($scope.shape);

			/*TODO: This is a rough estimate of the length needed to present the table id and tab tag.
			Ideally this should resize by means of CSS. I've not found a way to do it sofar. The background
			gets hidden by the limit of the parent div even when using overflow:vissible.*/
			$scope.infoMinWidth = 6 + $scope.table.id.length;
			if($scope.table.tab)
			$scope.infoMinWidth += $scope.table.tab.tag.length;

			//This is to trigger an update on the tab tags on venue map.
			//$scope.$watch($scope.table.tab && $scope.table.tab.tag, function(newValue, oldValue){
			$scope.$watch($scope.table.tab, function(newValue, oldValue){
				//console.log("table %s tagged as '%s'", $scope.table.table_id, $scope.table.tab.tag);
			});

			$scope.selectTable = function(){
				
				var editingMode = $scope.getModeFn();

				if(editingMode=="1"){
					$(iElm).find('.table-ui-control, .ui-resizable-handle').toggle(300);
				}

				$scope.selectTableFn({'table': $scope.table});
			};

			var uiControlsLocations = ["table-ui-control-top", "table-ui-control-bottom"];
			$scope.$watch($scope.y, function(newValue, oldValue){
				_updateTableToolsPosition();
			});

			var _updateTableToolsPosition = function(){
				if($scope.y > 40)
					$scope.uiControlsLocation = uiControlsLocations[0];
				else
					$scope.uiControlsLocation = uiControlsLocations[1];
			};

			var _updateTablePosition = function( event, ui ){
				$scope.table.x = $scope.x = ui.position.left;
				$scope.table.y = $scope.y = ui.position.top;
				$scope.$apply();
				//console.log("stopped dragging. %o, %o, %o", $scope.table, $scope.x, $scope.y);
				RittyStorage.updateTable($scope.table);
				_updateTableToolsPosition();
			};

			var _updateTableDimensions = function( event, ui ){
				$scope.table.w = $scope.w = ui.helper.width();
				$scope.table.h = $scope.h = ui.helper.height();
				$scope.$apply();
				RittyStorage.updateTable($scope.table);
			};

			function _updateTableRotationClock( event, ui ){
				_updateTableRotation(1);
			}

			function _updateTableRotationCounter( event, ui ){
				_updateTableRotation(-1);
			}

			function _updateTableRotation(clockwise){
				$scope.table.rotation = $scope.rotation = clockwise * 15 * Math.PI / 180 + parseFloat($scope.rotation);
				$scope.$apply();
				RittyStorage.updateTable($scope.table);
			}

			function _updateTableShape(){
				shapeIndex = (shapeIndex + 1) % shapes.length;
				$scope.table.shape = $scope.shape = shapes[shapeIndex];
				$scope.$apply();
				RittyStorage.updateTable($scope.table);
			}

			var initUiInteractions = function(){
				
				/*Enable clockwise rotation for the table object asociated to this directive*/
				$(iElm).find('.table-rotate-clock-handle').click(function(){
					_updateTableRotationClock();
				});

				/*Enable counter-clockwise rotation for the table object asociated to this directive*/
				$(iElm).find('.table-rotate-counterclock-handle').click(function(){
					_updateTableRotationCounter();
				});

				/*Enable switching shapes for the table object asociated to this directive*/
				$(iElm).find('.table-shape-switch-handle').click(function(){
					_updateTableShape();
				});

				return $(iElm).find('.table')

				/*Enable translation for the table object asociated to this directive*/
				.draggable({
					"containment": "#layer1",
					/*"handle": ".table-drag-handle",*/
					"disabled": true,
					"scroll": true,
					"grid": [10,10],
					"snap": false,
					"stop": _updateTablePosition
				})

				/*Enable scaling for the table object asociated to this directive*/
				.resizable({
					"containment": "#layer1",
					//"maxHeight": 120,
					//"maxWidth": 120,
					"disabled": true,
					"minHeight": 20,
					"minWidth": 20,
					"grid": 10,
					"ghost": false,
					"resize": function( event, ui ) {

						var h = ui.size.height;
						var w = ui.size.width;
						
						$(this).find('ellipse').attr('rx', w/2)
											   .attr('ry', h/2)
											   .attr('cx', w/2)
											   .attr('cy', h/2);

						$(this).find('rect').attr('width',  w)
											.attr('height', h);
						
					},
					"stop": _updateTableDimensions
				});
			};
			
			var uiInteractions;
			$scope.$watch($scope.getModeFn, function(newValue, oldValue){
				
				if(!uiInteractions)
				uiInteractions = initUiInteractions();

				if(newValue == 1){
					//$(iElm).find('.table-ui-control, .ui-resizable-handle').show(300);
					uiInteractions.draggable("enable").resizable("enable");
				}
				else{
					$(iElm).find('.table-ui-control, .ui-resizable-handle').hide(300);
					uiInteractions.draggable("disable").resizable("disable");
				}
			});


			$scope.$watch($scope.getShowTableControlsFn, function(newValue, oldValue){
				
				if(newValue){
					$(iElm).find('.table-ui-control, .ui-resizable-handle').show(300);
				}
				else{
					$(iElm).find('.table-ui-control, .ui-resizable-handle').hide(300);
				}

			});

		}
	};
}]);