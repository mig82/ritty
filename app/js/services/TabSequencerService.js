angular.module('ritty').factory('TabSequencerService', [function(){
	
	var _tabPrefix = "tab";
	var _itemPrefix = "item";
	var today;
	var tabSequence = 1; //TODO: restore last tabSequence value from storage.
	var tabItemSequence = 1; //TODO: restore last tabItemSequence value from storage.

	return {
		getNewTabId: function (){

			if (!today)
			today = moment().format("YYMMDD");

			var now = moment().format("YYMMDD");

			//At 12:00 AM change the prefix to today's and reset the tabSequence.
			if(today != now)
			{
				today = now;
				tabSequence = 1;
			}

			//TODO: Persist tabSequence so that it can be restored if the application is restarted during the day.

			return _tabPrefix.concat(today, "-", tabSequence++);
		},

		getNewTabItemId: function (){

			if (!today)
			today = moment().format("YYMMDD");

			var now = moment().format("YYMMDD");

			//At 12:00 AM change the prefix to today's and reset the tabItemSequence.
			if(today != now)
			{
				today = now;
				tabItemSequence = 1;
			}

			//TODO: Persist tabSequence so that it can be restored if the application is restarted during the day.

			return _itemPrefix.concat(today, "-", tabItemSequence++);
		}
	};
}])