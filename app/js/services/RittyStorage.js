angular.module('ritty').factory('RittyStorage', ['$indexedDB', 'Table', 'Menu', function($indexedDB, Table, Menu){

	/*
		store.getAllKeys - Returns all the primary keys on the store
		store.clear - Deletes all items from the store
		store.delete - Deletes a single item from the store
		store.upsert - Upserts an item or list of items in the store
		store.insert - Inserts an item or list of items in the store
		store.getAll - Returns all items in the store
		store.each - iterates over all items in the store
		store.eachBy - iterates over all items in the store using a named index.
		store.eachWhere - uses the query() to execute a find against the store
		store.findWhere - an alias for findWhere
		store.count - returns a count of all the items
		store.find - returns a single item from the store
		store.findBy - searches a particular index for an item
		store.query - builds a new query obect for use against eachWhere
	*/

	var _storeNames = {
		VENUES_STORE: "venues",
		TABLES_STORE: "tables",
		MENUS_STORE: "menus", 
	};

	/*	{storeName}: String.
		{storeItems}: Either an array or a single object.
	*/
	var _populateStore = function(storeName, storeItems)
	{
		return new Promise(function(resolve, reject)
		{
			$indexedDB.openStore(storeName, function(store){

				if(storeItems)
				store.upsert(storeItems).then(
					function(e){
						console.info("Success upserting items into '%s' store %o: ", storeName, e);
						resolve(e);
					},
					function(error){
						console.error("Error upserting items into '%s' store %o: ", storeName, error);
						reject(Error(error));
					}
				);
			});
		});
	}

	var _getStoreItems = function(storeName, venueId)
	{
		return new Promise(function(resolve, reject)
		{
			$indexedDB.openStore(storeName, function(store){
				console.log("Store %o", store);
				//store.getAll().then(
				window.store = store;
				//store.findBy("venue_id", venueId).then(
				store.findWhere(store.query().$index("venue_id").$eq(venueId)).then(
					function(storeItems){
						console.info("Success querying %s from IndexedDB %o", storeName, storeItems);
						resolve(storeItems);
					},
					function(error){
						console.error("Error querying %s from IndexedDB %o", storeName, error);
						reject(Error(error));
					}
				);
			});
		});
	};

	var _getStoreItem = function(storeName, itemId)
	{
		return new Promise(function(resolve, reject)
		{
			$indexedDB.openStore(storeName, function(store){

				store.find(itemId).then(
					function(item){
						//console.info("Success querying venue %o", venue);
						resolve(item);
					},
					function(error){
						//console.error("Error querying venue %o", error);
						reject(Error(error));
					}
				);
			});
		});
	};

	var _getVenue = function(venueId)
	{
		return _getStoreItem(_storeNames.VENUES_STORE, venueId);
	};

	var _getVenues = function()
	{
		return _getStoreItems(_storeNames.VENUES_STORE)
		.then(function (venueObjs) {
			var venues = Venue.fromObjArray(venueObjs);
			return venues;
		});
	};

	var _getTables = function(venueId)
	{
		return _getStoreItems(_storeNames.TABLES_STORE, venueId)
		.then(function(tableObjs){
			var tables = Table.fromObjArray(tableObjs);
			return tables;
		});
	};

	var _getMenus = function(venueId)
	{
		return _getStoreItems(_storeNames.MENUS_STORE, venueId)
		.then(function(menuObjs){
			var menus = Menu.fromObjArray(menuObjs);
			return menus;
		});
	};

	var _updateTable = function(table){
		return _populateStore(_storeNames.TABLES_STORE, table);
	};

	return{
		
		storeNames: _storeNames,
		getVenue: _getVenue, 
		getVenues: 	_getVenues,
		getTables: 	_getTables,
		getMenus: 	_getMenus,
		populateStore: _populateStore,
		updateTable: _updateTable
	};
}])