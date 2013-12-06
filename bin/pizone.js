#!/usr/local/bin/node

var FileSystem = require('fs');
//nohup node simple-server.js > output.log &


//file path to file containing JSON data of mac addresses
var ADDRESS_DATA_PATH = "/etc/pizone/address.json";

//interval in milliseconds that address will be rotated
var REFRESH_INTERVAL = 100 * 60 * 1; //1 minute

var addresses = [];
var intervalId;
var index = 0;

var ROOT_ID = 0;
//chech that we are running as root
if(process.getuid() != ROOT_ID){
	console.log("Script must be run as root.");
	process.exit(1);
};

var init = function() {
	loadAddressData(
		function(){
			resetInterval();
		},
		function (err) {
			//what should we do here?
			//right now we error and exit
			console.log("Error : main : cannot load adddress data. Aborting.");
			process.exit(1);
		});
};

var loadAddressData = function(onSuccessCallback, onErrorCallback) {
	
	FileSystem.readFile(ADDRESS_DATA_PATH, 'utf8', function (err, data) {
		
		if (err) {
			console.log("loadAddressData");
			console.log(err);
			onErrorCallback(err);
			return;
		}

		//should e explicitly check its length?
		if(!data) {
			//error
		}
		
		addresses = JSON.parse(data);
		onSuccessCallback();
	});
};

var resetInterval = function(){
	if(intervalId) {
		clearInterval(intervalId);
		intervalId = 0;
	}
	
	intervalId = setInterval(
		onInterval,
		REFRESH_INTERVAL);
};

var onInterval = function() {
	
	if(!addresses.length) {
		index = 0;
		return;
	}
	
	var item = addresses[index];
	console.log(item);
	
	index++;
	
	if (index >= addresses.length) {
		index = 0;
	}	
};

init();