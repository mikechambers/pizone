#!/usr/local/bin/node

//nohup node simple-server.js > output.log &


//file path to file containing JSON data of mac addresses
var ADDRESSES_JSON = "/etc/pizone/address.json";

//interval in milliseconds that address will be rotated
var REFRESH_INTERVAL = 100 * 60 * 1; //1 minute


var ROOT_ID = 0;
//chech that we are running as root
if(process.getuid() != ROOT_ID){
	console.log("Script must be run as root.");
	process.exit(1);
}



var init = function() {
	//load json data and store in varriable
	//start main 
}

var main = function() {
	//start http server
	//start runtime loop
}

var onInterval = function() {
	
}

init();


var index = 0;

var timerId = setInterval(
	function (){
		console.log(index++);
	}, REFRESH_INTERVAL)