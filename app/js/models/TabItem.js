/**
*  Module
*
* Defines the TabItem class which defines the objects in the tab property of the Tab class.
*/
angular.module('ritty').factory('TabItem', ['gettext', 'TabSequencerService', function(gettext, TabSequencerService){

	function TabItem(id, title, xn, price, vat){

		if(!id){
			this.id = TabSequencerService.getNewTabItemId();	
		}
		
		this.title = title;
		this.xn = xn;
		this.price = price;
		this.vat = vat;
		this.pricexn = xn * price;
		this.vatxn = xn * vat;
		//this.orderTime = new Date();
		this.status = TabItem.STATUS_NEW;
		this.updated = new Date();
	}

	TabItem.prototype.setXN = function(xn){
		this.pricexn = Math.round10(xn * this.price, -2);
		this.vatxn =   Math.round10(xn * this.vat, -2);
		this.xn = Math.round10(xn, -2);
	};

	var STATUS_NEW		= {id: 00, desc: gettext('TABITEM_STATUS_NEW')};
	var STATUS_ORDERED	= {id: 10, desc: gettext('TABITEM_STATUS_ORDERED')};
	var STATUS_SERVED	= {id: 20, desc: gettext('TABITEM_STATUS_SERVED')};
	var STATUS_PAID		= {id: 20, desc: gettext('TABITEM_STATUS_PAID')};
	var STATUS_SENTBACK	= {id: 30, desc: gettext('TABITEM_STATUS_SENTBACK')};
	var STATUS_SPILLED	= {id: 40, desc: gettext('TABITEM_STATUS_SPILLED')};
	//Use angular.copy to prevent unwanted modifcations of these constants.
	TabItem.STATUS_NEW		= angular.copy(STATUS_NEW);
	TabItem.STATUS_ORDERED	= angular.copy(STATUS_ORDERED);
	TabItem.STATUS_SERVED	= angular.copy(STATUS_SERVED);
	TabItem.STATUS_PAID		= angular.copy(STATUS_PAID);
	TabItem.STATUS_SENTBACK	= angular.copy(STATUS_SENTBACK);
	TabItem.STATUS_SPILLED	= angular.copy(STATUS_SPILLED);

	TabItem.prototype.transition = function(){
		switch(this.status)
		{
			case TabItem.STATUS_NEW:
				this.status = TabItem.STATUS_ORDERED;
				this.updated = new Date();
				//TODO: Write to log for later data mining.
			break;

			case TabItem.STATUS_ORDERED:
				this.status = TabItem.STATUS_SERVED;
				this.updated = new Date();
				//TODO: Write to log for later data mining.
			break;

			case TabItem.STATUS_SERVED:
				this.status = TabItem.STATUS_PAID;
				this.updated = new Date();
				//TODO: Write to log for later data mining.
			break;
		} 
		
	};

	TabItem.fromMenuItem = function(menuItem, xn){
		
		return new TabItem(
			false,
			menuItem.title,
			xn,
			menuItem.price,
			menuItem.vat
		);
	};

	TabItem.fromObj = function(obj){
		
		var tabItem = new TabItem(
			obj.id,
			obj.title, 
			obj.xn,
			obj.price,
			obj.vat
		);

		//tabItem.orderTime = obj.orderTime;
		tabItem.updated = obj.updated;
		tabItem.status = obj.status;

		return tabItem;
	};

	TabItem.fromObjArray = function(tabObjs){

		var len = tabObjs.length;
		var tabItems = new Array(len);

		for (var i = 0; i < len; i++) {
			tabItems[i] = TabItem.fromObj( tabObjs[i] );
		}

		return tabItems;
	};

	return TabItem;
}]);