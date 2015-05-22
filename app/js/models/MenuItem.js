/**
*  Module
*
* The MenuItem class which defines the objects in the 'items' property of the Menu class.
*/
angular.module('ritty').factory('MenuItem', ['gettext', function(gettext){

	"use strict";
	
	function MenuItem(title, desc, pricing, price, vat, minpax, callories, eta){
		
		this.title =  title;
		this.desc =  desc;
		this.pricing =  pricing
		this.price =  price;
		this.vat = vat;
		this.minpax =  minpax;
		this.callories = callories;
		this.eta = eta;
		this.tags = new Array();

	}

	var PRICING_FIXED	= gettext('PRICING_FIXED');
	var PRICING_MARKET	= gettext('PRICING_MARKET');
	
	MenuItem.PRICING_FIXED	= angular.copy(PRICING_FIXED);		
	MenuItem.PRICING_MARKET = angular.copy(PRICING_MARKET);

	MenuItem.prototype.isFixedPriced = function(){
		return this.pricing == MenuItem.PRICING_FIXED;
	};

	MenuItem.fromObj = function(obj){
		
		var menuItem = new MenuItem(
			obj.title,
			obj.desc,
			obj.pricing,
			obj.price,
			obj.vat,
			obj.minpax,
			obj.callories,
			obj.eta
		);

		if(obj.tags)
		menuItem.tags = obj.tags;
	
		return menuItem;
	};

	MenuItem.fromObjArray = function(menuItemObjs){

		var len = menuItemObjs.length;
		var menuItems = new Array(len);

		for (var i = 0; i < len; i++) {
			menuItems[i] = MenuItem.fromObj( menuItemObjs[i] );
		}
		console.log("menuItems: %o", menuItems);
		return menuItems;
	};

	return MenuItem;
}]);