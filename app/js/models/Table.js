/**
*  Module
*
* Defines the Table class.
*/
angular.module('ritty').factory('Table', ['Tab', function(Tab){

	function Table(venue_id, table_id, h, w, x, y, shape, rotation){
		
		this.venue_id = venue_id;
		this.table_id = table_id;
		this.id = venue_id + "." + table_id;
		
		this.h = h;
		this.w = w;
		this.x = x;
		this.y = y;
		this.shape = shape;
		this.rotation = rotation;
	}

	var SHAPE_SQUARED		= "rect";
	var SHAPE_ELLIPTICAL	= "ellipse";

	//Use angular.copy to prevent unwanted modifcations of these constants.
	Table.SHAPE_SQUARED = angular.copy(SHAPE_SQUARED);
	Table.SHAPE_ELLIPTICAL = angular.copy(SHAPE_ELLIPTICAL);
	

	Table.fromObj = function(obj){
		
		var table = new Table(
			obj.venue_id,
			obj.table_id,
			obj.h,
			obj.w,
			obj.x,
			obj.y,
			obj.shape,
			obj.rotation
		);

		if(obj.tab)
		table.tab = Tab.fromObj(obj.tab);

		return table;
	};

	Table.fromObjArray = function(tableObjs){

		var len = tableObjs.length;
		var tables = new Array(len);

		for (var i = 0; i < len; i++) {
			tables[i] = Table.fromObj( tableObjs[i] );
		}
		console.log("tables: %o", tables);
		return tables;
	};

	return Table;
}]);