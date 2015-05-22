/**
*  Module
*
* The Venue class which defines all representations of a bar or restaurant establishment.
*/
angular.module('ritty').factory('Venue', ['gettext', function(gettext){

	"use strict";

	function Venue(id , name, desc, vat, pricesIncVat){
		
		this.id  = id ;
		this.name = name;
		this.desc = desc;
		this.vat = vat; //The Value Added Tax percentage, expressed as a rational/decimal number between 0 and 1.
		this.pricesIncVat = pricesIncVat; // Whether {true, false} the prices on the menu should be shown with or without adding VAT on top of price.
	}

	Venue.fromObj = function(obj){
		console.log("Venue.fromObj: parsing object %o", obj);
		var venue = new Venue(
			obj.id,
			obj.name,
			obj.desc,
			obj.vat,
			obj.pricesIncVat
		);
		
		return venue;
	};

	Venue.fromObjArray = function(venueObjs){
		console.log("Venue.fromObjArray: parsing object %o", venueObjs);
		var len = venueObjs.length;
		var venues = new Array(len);

		for (var i = len-1; i >= 0; i--) {
			venues.push(Venue.fromObj( venueObjs[i] ))
		};

		console.log("venues: %o", venues);
		return venues;
	};

	return Venue;
}]);