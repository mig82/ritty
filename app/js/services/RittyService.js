angular.module('ritty').factory('RittyService', ['RittyStorage', 'Tab','TabItem', function(RittyStorage, Tab, TabItem){

	var _venue; //Object
	var _table; //Object

	var _venues; //Array
	var _tables; //Array
	var _menus; //Array

	var _xn = 1;

	return {
		
		getVenues: function(){
			return _venues;
		},

		setVenues: function(venues){
			//console.log("venues is %o", venues);
			_venues = venues;
			_venue = _venues[0];
		},

		getTables: function(){
			return _tables;
		},

		setTables: function(tables){
			_tables = tables;
			_table = _tables[0];
		},

		getMenus: function(){
			return _menus;
		},

		setMenus: function(menus){
			_menus = menus;
		},

		selectVenue: function(venue){
			_venue = venue;
			console.log('Selecting venue %o', _venue);
		},

		getSelectedVenue: function(){
			return _venue;
		},

		selectTable: function(table){
			_table = table;
		},

		getSelectedTable: function(){
			return _table;
		},

		selectedTableHasTab: function(){
			return _table && _table.tab && _table.tab.newItems;
		},

		setXN: function(xn){
			_xn = xn;
		},

		getXN: function(){
			return _xn;
		},

		//Creates xN TabItem's from a given MenuItem and adds it to the tab on the selected table.
		addItemToTab: function(menuItem){
			var tabItem = TabItem.fromMenuItem(menuItem, _xn);
			//console.log("Adding x%s of item: %o to tab", _xn, tabItem);
			_table.tab.addTabItem(tabItem);
			RittyStorage.updateTable(_table);
		},

		//Creates a new tab on the selected table.
		openTab: function(tag, pax){
			_table.tab = new Tab(false, false, tag, pax);
			RittyStorage.updateTable(_table);
		},

		//Removes x1 of a TabItem from the tab on the selected table.
		removeItemFromTab: function(tabItem){
			_table.tab.removeTabItem(tabItem);
			RittyStorage.updateTable(_table);
		},

		addAnotherToTab: function(tabItem){
			_table.tab.addAnotherTabItem(tabItem);
			RittyStorage.updateTable(_table);
		},

		sendForPrep: function(){
			//TODO: Notify PrepService so that tickets can be generated for the new items.
			_table.tab.sendForPrep();
			RittyStorage.updateTable(_table);
		},

		/*moveItemToSubTab: function(itemId, originTabId, targetTabId){
			_table.tab.moveItemToSubTab(itemId, originTabId, targetTabId);
			//I don't think it necessary to persit subtabs at this point since they are just a temporary utility.
		},*/

		moveTabItem: function(originList, oldPosition, targetList, newPosition){
			_table.tab.moveTabItem(originList, oldPosition, targetList, newPosition);
		}
	};
}]);