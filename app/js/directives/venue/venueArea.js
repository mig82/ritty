angular.module('ritty').directive('venueArea', ['$timeout', function($timeout){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			w: '=',
			h: '=',
			path: '=',
			getModeFn: '&'
		},
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'directives/venue-area.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
			var _updateNodePosition = function( event, ui ){
				var index = $(this).data('index');
				$scope.strokes[index].x = ui.position.left + 10; //The CSS 'svg-editing-node' class has a width of 20px.
				$scope.strokes[index].y = ui.position.top + 10; //The CSS 'svg-editing-node' class has a height of 20px.
				genDrawingPath();
				$scope.$apply();
			};

			var _commitStrokes = function( event, ui ){

				//RittyStorage.updateStrokes($scope.strokes);
			};

			var strokes = [
				{ instruction: "M", x: 10 ,	y: 10	},
				{ instruction: "L", x: 200,	y: 10	},
				{ instruction: "L", x: 200,	y: 50	},
				{ instruction: "L", x: 600,	y: 50	},
				{ instruction: "L", x: 600,	y: 200	},
				{ instruction: "L", x: 100,	y: 200	},
				{ instruction: "L", x: 100,	y: 250	},
				{ instruction: "L", x: 10 ,	y: 250	},
				{ instruction: "L", x: 10 ,	y: 10	}
			];
			$scope.strokes = strokes;

			var genDrawingPath = function(){
				var drawing = "";
				for (var i = 0; i < strokes.length; i++) {
					var s = strokes[i];
					drawing = drawing.concat(s.instruction, " ", s.x, " ", s.y, " ");
				};
				$scope.drawing = drawing;
			}
			genDrawingPath();

			var initNodeDragging = function(){
				return $(iElm).find('.svg-editing-node').draggable({
					"containment": "#layer2",
					/*"disabled": true,*/
					"scroll": true,
					"grid": [5,5],
					/*"snap": true,*/
					"disabled": true,
					"drag": _updateNodePosition,
					"stop": _commitStrokes
				});
			};
			
			var draggables;

			$scope.$watch($scope.getModeFn, function(newValue, oldValue){
				
				if(!draggables)
				draggables = initNodeDragging();

				if($scope.getModeFn() == 2){
					$('.svg-editing-node').show(300);
					draggables.draggable("enable");
				}
				else{
					$('.svg-editing-node').hide(300);
					draggables.draggable("disable");
				}
			});

		}
	};
}]);