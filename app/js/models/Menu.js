/**
*  Module
*
* The Menu class which defines the objects in the 'menus' property of the Venue class.
*/
angular.module('ritty').factory('Menu', ['gettext', 'MenuItem', function(gettext, MenuItem){

	"use strict";
	
	function Menu(venue_id , menu_id, title, desc){
		
		if(venue_id && menu_id)
		{
			this.venue_id  = venue_id ;
			this.menu_id = menu_id;
			this.id = venue_id  + "." + menu_id;
		}

		this.title = title;
		this.desc = desc;
		this.submenus = new Array();
		this.items = new Array();

	}

	Menu.fromObj = function(obj){
		console.log("Menu.fromObj: parsing object %o", obj);
		var menu = new Menu(
			obj.venue_id,
			obj.menu_id,
			obj.title,
			obj.desc
		);

		if(obj.submenus)
		menu.submenus = Menu.fromObjArray(obj.submenus);

		if(obj.items)
		menu.items = MenuItem.fromObjArray(obj.items);
		
		return menu;
	};

	Menu.fromObjArray = function(menuObjs){
		console.log("Menu.fromObjArray: parsing object %o", menuObjs);
		var len = menuObjs.length;
		var menus = new Array(len);

		for (var i = 0; i < len; i++) {
			menus[i] = Menu.fromObj( menuObjs[i] );
		}
		console.log("menus: %o", menus);
		return menus;
	};

	return Menu;
}]);