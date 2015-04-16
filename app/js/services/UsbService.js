angular.module('ritty').factory('UsbService', [function(){
	
	function _onUsbDeviceFound(devices)
	{
		console.log("USB devices found: %o", devices);
		if (devices)
		{
			if (devices.length > 0) {

				devices.forEach(function(device){
					console.log("USB device: %o", device);

					//chrome.hid.connect(device.deviceId, function (conectionHandle)
					chrome.usb.openDevice(device, _onUsbDeviceOpened);
				});
				
			}
			else {
				console.log("Device could not be found");
			}
		}
		else {
			console.log("Permission denied.");
		}
	}

	/*
	*	{conectionHandle} A ConnectionHandle handle
	*/
	function _onUsbDeviceOpened(connectionHandle)
	{
		console.log('Opened connection: %o', connectionHandle);
		
	}

	function _pollUsbDevices()
	{	
		var deviceOptions = {
			"mouse": {
				"vendorId" : parseInt("0x17EF"),
				"productId" : parseInt("0x600E")
			},
			"extHDAna":{
				"vendorId" : parseInt("0x07A8"),
				"productId" : parseInt("0x1042")
			},
			"winPhone":{
				"vendorId" : parseInt("0x0421"),
				"productId" : parseInt("0x0661")
			},
			"xperia":{
				"vendorId" : parseInt("0x0FCE"), //4046
				"productId" : parseInt("0x01AF") //431
			}
		};

		var deviceQuery = deviceOptions['xperia'];
		console.log("Querying for USB device %o", deviceQuery);
		
		chrome.usb.getDevices(deviceQuery, _onUsbDeviceFound);
	}

	return {
		pollUsbDevices: _pollUsbDevices
	};
}])



