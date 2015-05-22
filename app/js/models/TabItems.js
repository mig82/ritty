angular.module('ritty').factory('TabItems', ['TabItem', function(TabItem){

	'use strict';

	function TabItems(){
		this.items = new Array();
		this.subTotal = 0.00;
		this.vatTotal = 0.00;
	}

	TabItems.prototype.total = function(){
		return (this.subTotal + this.vatTotal);
	};

	TabItems.prototype.purge = function(){
		this.items = new Array();
		this.subTotal = 0.00;
		this.vatTotal = 0.00;
	};

	TabItems.prototype.push = function(item){
		if(item instanceof TabItem)
		{
			this.items.push(item);
			this.subTotal += item.pricexn;
			this.vatTotal += item.vatAmtXn;
			return this.items;
		}
		else
		{
			console.error("Object %s is not an instance of TabItem prototype.", item);
			return this.items;
		}
	};

	TabItems.prototype.pop = function(){
		var item = this.items.pop();
		this.subTotal -= item.pricexn;
		this.vatTotal -= item.vatAmtXn;
		return item;
	};

	TabItems.prototype.add = function(item){
		if(item instanceof TabItem)
		{
			this.items.unshift(item); //TODO: Should use push. I think I used this to force FIFO behavior.
			this.subTotal += item.pricexn;
			this.vatTotal += item.vatAmtXn;
			return this.items;
		}
		else
		{
			console.error("Object %s is not an instance of TabItem prototype.", item);
			return this.items;
		}
	};

	TabItems.prototype.addAnother = function(item){
		if(item instanceof TabItem)
		{
			//No need to look up the item as it is passed as a reference of a previously added item.
			item.setXN(item.xn + 1);
			this.subTotal += item.price;
			this.vatTotal += item.vatAmt;
			return this.items;
		}
		else
		{
			console.error("Object %s is not an instance of TabItem prototype.", item);
			return this.items;
		}
	};

	TabItems.prototype.remove = function(item){
		if(item.xn > 1)
		{
			//No need to look up the item as it is passed as a reference of a previously added item.
			item.setXN(item.xn - 1);
			this.subTotal -= item.price;
			this.vatTotal -= item.vatAmt;
		}
		else if (item.xn == 1)
		{
			this.items.splice(this.items.indexOf(item), 1);
			this.subTotal -= item.pricexn;
			this.vatTotal -= item.vatAmtXn;
		}
		return this.items;
	};

	TabItems.prototype.syncTotals = function(){
		var _subTotal = 0.00;
		var _vatTotal = 0.00;

		for (var i = this.items.length - 1; i >= 0; i--) {
			_subTotal += this.items[i].pricexn;
			_vatTotal += this.items[i].vatAmtXn;
		};

		this.subTotal = _subTotal;
		this.vatTotal = _vatTotal;
	};

	TabItems.fromObj = function(obj){
		
		var tabItems = new TabItems();

		tabItems.subTotal = obj.subTotal;
		tabItems.vatTotal = obj.vatTotal;
		
		if(obj.items)
		tabItems.items = TabItem.fromObjArray(obj.items);

		return tabItems;
	};

	return TabItems;
}]);