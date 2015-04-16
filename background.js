/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */


/*This is the 'Event Page' a.k.a. the Background Script.*/

/*To create the event page, include the "background" field in the app manifest and include the background.js
in the scripts array. Any library scripts used by the event page need to be added to the "background" field first:*/


/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {

	/*Handle 'launchData.items' to be launched with files.*/

	var start = Date.now();
	console.log("Ritty is being launched...");

	chrome.app.window.create(
		'index.html',
		{
			id: 'RittyMainWindow',
			bounds: {width: 1024, height: 768 },
			minWidth: 840,
			minHeight: 470/*,
			frame: 'none'*/
		}
	);

	console.log("Ritty has launched. Time elapsed: %s milliseconds", Date.now() - start );

});

//TODO: get last saved state from persistent storage.
chrome.app.runtime.onRestarted.addListener(function()
{
	var start = Date.now();
	console.log("Ritty is being restarted");
	//
	console.log("Ritty has restarted. Time elapsed: %s milliseconds", Date.now() - start );

});


/**REMEMBER: There´s a difference between chrome.app.runtime events (above) and chrome.runtime events (below).**/


//TODO: store local settings when installed or updated.
chrome.runtime.onInstalled.addListener(function()
{
	var start = Date.now();
	//At a minimum, store user settings so that it is still available if app is reinstalled.
	console.log("Ritty is being installed or updated...");

	console.log("Ritty has been installed or updated. Time elapsed: %s milliseconds", Date.now() - start );
});

//TODO: do clean-up tasks and save state before the event page is unloaded.
chrome.runtime.onSuspend.addListener(function()
{
	//Should save its current state to persistent storage so it can restart in the same state if it receives an onRestarted event
	//Only a few seconds to save state before termination, so it's a good idea to incrementally save state while running normally.
	var start = Date.now();
	console.log("Ritty is being suspended...");

	console.log("Ritty has been suspended. Time elapsed: %s milliseconds", Date.now() - start );
});

//TODO: Tasks to do if suspension is aborted.
chrome.runtime.onSuspendCanceled.addListener(function(){
	//
});
