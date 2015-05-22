angular.module('ritty').filter('menufilter', function() {
	return function(input, query) {
		
		//input is an array of submenus
		input = input || [];

		if(!query || query.length<5)
		{
			return input;
		}
		else
		{
			_query = query.toLowerCase();
			var out = [];
			input.forEach(function(submenu, index)
			{
				console.log("submenus[%s]=%o:", index, submenu);
				_items = submenu.items;
				_filtered = [];

				_items.forEach(function(item){

					console.log("item %o", item);
					_title = item.title.toLowerCase();
					_descr = item.desc.toLowerCase();
					if(_title.indexOf(_query)>=0 || _descr.indexOf(_query)>=0)
					_filtered.push(item);
					console.log('_filtered %o', _filtered);
				});
				submenu.items = _filtered;
				out.push(submenu);
			});

			return out;
		}
		
		
	};
});