/**
*  Module
*
* Defines the Tab class which defines the objects in the tab property of the Tab class.
*/
angular.module('ritty').factory('Tab', ['gettext', 'TabItem', 'TabSequencerService', function(gettext, TabItem, TabSequencerService){

	function Tab(parentTabId, id, tag, pax){
		
		if(parentTabId){
			this.parentTabId = parentTabId;	
		}
		else{
			this.parentTabId = "";
		}
		
		if(id){
			this.id = id;
		}
		else{
			this.id = TabSequencerService.getNewTabId();	
		}
		
		this.subTabSeq = 1;
		this.tag = tag;
		this.pax = pax;
		this.newItemsTotal = 0.00;
		this.total = 0.00;
		this.vat = 0.00;
		this.tip = 0.00;
		this.status = Tab.STATUS_NEW;
		this.openingTime = new Date();
		this.newItems = new Array(); //TabItems which have not been sent for preparation yet.
		this.tabItems = new Array(); //TabItems which have already been sent for preparation.
		this.subTabs; //An array of children tabs used for splitting the bill when paying. Will be lazy initialized.
	}

	Tab.prototype.addTabItem = function(tabItem){
		
		if(tabItem.status == TabItem.STATUS_NEW){
			this.newItems.unshift(tabItem);
		}
		else{
			this.tabItems.unshift(tabItem);
		}
		this._addToTabTotals(tabItem);
	};

	Tab.prototype.addAnotherTabItem = function(tabItem){
		tabItem.setXN(tabItem.xn+1);
		this._addToTabTotals(tabItem, 1);
	};

	Tab.prototype.removeNewItem = function(tabItem)
	{
		if(tabItem.xn > 1)
		{
			tabItem.setXN(tabItem.xn-1);
		}
		else if (tabItem.xn == 1)
		{
			this.newItems.splice(this.newItems.indexOf(tabItem), 1);
		}

		this._subtractFromTabTotals(tabItem);
	};

	Tab.prototype.popTabItem = function()
	{
		var tabItem = this.tabItems.pop();
		this._subtractFromTabTotals(tabItem, true);
		return tabItem;
	};

	Tab.prototype._addToTabTotals = function(tabItem, xn)
	{
		if(xn)
		{
			if(tabItem.status == TabItem.STATUS_NEW){
				this.newItemsTotal += xn * tabItem.price;
			}
			else{
				this.total += xn * tabItem.price;
				//this.vat += xn * tabItem.vat;
			}
		}
		else
		{
			if(tabItem.status == TabItem.STATUS_NEW){
				this.newItemsTotal += tabItem.pricexn;
			}
			else{
				this.total += tabItem.pricexn;
				//this.vat += tabItem.vatxn;
			}
		}
	};

	Tab.prototype._subtractFromTabTotals = function(tabItem, removeAll){
		
		if(tabItem.status == TabItem.STATUS_NEW)
		{
			if(removeAll)
			this.newItemsTotal -= tabItem.pricexn;
			else
			this.newItemsTotal -= tabItem.price;
		}
		else
		{	
			if(removeAll)
			this.total -= tabItem.pricexn;
			else
			this.total -= tabItem.price;
			//this.vat -= tabItem.vat;
		}
	};

	Tab.prototype.sendForPrep = function(){

		var l = this.newItems.length;
		for (var i = 0; i < l; i++) {
			var item = this.newItems[i];
			item.transition();
			this.tabItems.push(item);
		};

		this.total += this.newItemsTotal;
		this.newItemsTotal = 0.00;
		this.newItems = new Array();

		if(this.status.id == Tab.STATUS_NEW.id)
		this.status = Tab.STATUS_SERVING;
	};

	Tab.prototype.createSubTab = function(){
		if(!this.subTabs)
		{
			//Keep a backup of the original items in the tab so the split can be undone.
			this._backupTabItems();
			this.subTabs = new Array();
		}
		this.subTabs.push(   new Tab(this.id, this.id.concat(".", this.subTabSeq++))   );
	};

	Tab.prototype.syncTotals = function(){

		//TODO: Sync totals for newItems?

		//Sync totals for tabItems.
		var _total = 0.00;
		var _vat = 0.00;
		var tabLength = this.tabItems.length;
		for (var i = 0; i < tabLength; i++) {
			_total += this.tabItems[i].pricexn;
			_vat += this.tabItems[i].vatxn;
		};
		this.total = _total;
		this.vat = _vat;

		//Sync totals for each child tab in subTabs.
		if(this.subTabs){
			var subTabsLength = this.subTabs.length;
			for (var i = 0; i < subTabsLength; i++) {
				this.subTabs[i].syncTotals();
			};
		}
	};

	Tab.prototype.splitEven = function(){
		
		//Keep a backup of the original items in the tab so the split can be undone.
		this._backupTabItems();

		var m = this.tabItems.length;
		var t = this.subTabs.length;

		//for each of the m items in the tab...	
		for (var i = m-1; i >= 0; i--) {

			var item = this.popTabItem();
			//var gcd = Math.gcd(item.xn, t)

			var num = item.xn; //item.xn / gcd;
			var den = t; //t / gcd;
			
			item.fraction = "".concat(num, "/", den);
			item.setXN(num / den);

			for (var j = t-1; j >= 0; j--) {
				this.subTabs[j].addTabItem(angular.copy(item));
			};

		};
	};

	Tab.prototype._backupTabItems = function(){
		if(!this.backup){
			this.backup = {};
		}

		if(!this.backup.tabItems){
			this.backup.tabItems = angular.copy(this.tabItems)
		}
		console.log("Backed up %o", this);
	};

	Tab.prototype.cancelSubTabs = function(){
		if(this.backup && this.backup.tabItems){
			this.tabItems = this.backup.tabItems;
			delete this.backup.tabItems;
		}
		this.subTabs = new Array();
		this.syncTotals();
		console.log("Cancelled %o", this);
	};

	var STATUS_NEW				= {id: 00, desc: gettext('TAB_STATUS_NEW')};
	var STATUS_SERVING			= {id: 10, desc: gettext('TAB_STATUS_SERVING')};
	//var STATUS_ENTREES		= {id: 13, desc: gettext('TAB_STATUS_ENTREES')};
	//var STATUS_MAINS			= {id: 16, desc: gettext('TAB_STATUS_MAINS')};
	//var STATUS_DESSERTS		= {id: 19, desc: gettext('TAB_STATUS_DESSERTS')};
	var STATUS_WAITCHECK	 	= {id: 20, desc: gettext('TAB_STATUS_WAITCHECK')};
	//var STATUS_WAITRECEIPT	= {id: 30, desc: gettext('TAB_STATUS_WAITRECEIPT')};
	var STATUS_CLOSED			= {id: 40, desc: gettext('TAB_STATUS_CLOSED')};
	var STATUS_PROBLEM			= {id: 99, desc: gettext('TAB_STATUS_PROBLEM')};

	//Use angular.copy to prevent unwanted modifcations of these constants.
	Tab.STATUS_NEW			= angular.copy(STATUS_NEW);		
	Tab.STATUS_SERVING 		= angular.copy(STATUS_SERVING);
	//Tab.STATUS_ENTREES		= angular.copy(STATUS_ENTREES);	
	//Tab.STATUS_MAINS 		= angular.copy(STATUS_MAINS);
	//Tab.STATUS_DESSERTS		= angular.copy(STATUS_DESSERTS);
	Tab.STATUS_WAITCHECK 	= angular.copy(STATUS_WAITCHECK);
	//Tab.STATUS_WAITRECEIP	= angular.copy(STATUS_WAITRECEIP);
	Tab.STATUS_CLOSED 		= angular.copy(STATUS_CLOSED);
	Tab.STATUS_PROBLEM		= angular.copy(STATUS_PROBLEM);

	/*TODO: Implement a finite state machine which defines the
	permited the status transitions in the workflow/lifecycle of a tab.*/
	Tab.transition = function()
	{};

	Tab.fromObj = function(obj){
		
		var tab = new Tab(
			obj.parentTabId,
			obj.id,
			obj.tag,
			obj.pax
		);

		tab.subTabSeq = obj.subTabSeq;
		tab.total = obj.total;
		tab.vat = obj.vat;
		tab.tip = obj.tip;
		tab.status = obj.status;
		tab.openingTime = obj.openingTime;

		if(obj.newItems)
		tab.newItems = TabItem.fromObjArray(obj.newItems);

		if(obj.tabItems)
		tab.tabItems = TabItem.fromObjArray(obj.tabItems);
		
		return tab;
	};

	return Tab;
}]);