/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, process, console, clearInterval, setInterval */

/* TODO

    -may want to use setTimeout and not setInterval
    so the next loop only starts once the previous execution has ended
    
*/

(function () {
    "use strict";

    var FileSystem = require("fs");
    var ChildProcess = require("child_process");
    //nohup node simple-server.js > output.log &
    
    
    //file path to file containing JSON data of mac addresses
    var ADDRESS_DATA_PATH = "/etc/pizone/address.json";
    
    //interval in milliseconds that address will be rotated
    var REFRESH_INTERVAL = 1000 * 60 * 10; //1 minute
    
    //timeout interval when call external commands
    var PROCESS_TIMEOUT = 1000 * 30;

    var randomizeAddress = true;
    
    var addresses = [];
    var intervalId;
    var index = 0;
    
    
/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

    var loadAddressData = function (onSuccessCallback, onErrorCallback) {
        
        FileSystem.readFile(ADDRESS_DATA_PATH, 'utf8', function (err, data) {
            
            if (err) {
                console.log("loadAddressData");
                console.log(err);
                onErrorCallback(err);
                return;
            }
    
            if (!data) {
                //right now, we fail silently if there is no data (i.e. empty string)
                //maybe we should fail and exit?
                console.log("error");
            } else {
                try {
                    addresses = JSON.parse(data);
                    
                    //make sure it is an array
                    if (Object.prototype.toString.call(addresses) !== "[object Array]") {
                        throw "Object not Array";
                    }
                    
                } catch (e) {
                    console.log("Error : Address data JSON is not in correct format.");
                    addresses = [];
                }
            }

            if (randomizeAddress){
            
            }
            
            onSuccessCallback();
        });
    };
    
    var updateAddress = function (address, ssid, onSuccess, onError) {
        
        //^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$
        
        if (!address.match(/^([0-9A-F]{2}[:\-]){5}([0-9A-F]{2})$/g)) {
            onError("Invalid mac address");
            return;
        }
        
        if (!ssid || !ssid.length) {
            onError("Invalid SSID.");
            return;
        }
        
        //note, the arguments are not passed on the shell, so we don't have to worry
        //about injection (although the script being called does)
        //http://stackoverflow.com/questions/15168071/how-secure-is-using-execfile-for-bash-scripts
        var cmd = ChildProcess.execFile(
            "cmac",
            [ssid, address],
            {timeout: PROCESS_TIMEOUT},
            function (err, stdout, stderr) {
                if (err) {
                    console.log("updateAddress:error");
                    console.log(err);
		    onError(err);
                } else {
		    	if (stdout) {
				console.log(stdout);
			}
		    onSuccess();
                }
            }
        );
        
	//note, exit is called before the callbacks before are called
	//so we use those to capture output and know when the process has exited
	/*
        cmd.on("exit", function (code) {
            console.log("cmd exit");
        });
	*/
        
    };
    
    var incrementIndex = function () {
	index++;
        
        if (index >= addresses.length) {
            index = 0;
        }
    };
    
    var loadNextAddress = function () {
        if (!addresses.length) {
            index = 0;
            return;
        }
        
        var item = addresses[index];
        
        //check values in item to make sure they are valid
        //mac address is valid, and ssid is not null
        
        console.log(item.description + " : " + item.address + " : " + item.ssid);
        //need to escape
        
        updateAddress(item.address, item.ssid,
            function () {
                incrementIndex();
            },
            function (err) {
                console.log("Error setting address:");
                console.log(err);
                incrementIndex();
            });
    };
    
    var onInterval = function () {
        loadNextAddress();
    };
    
    var resetInterval = function () {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = 0;
        }
        
        intervalId = setInterval(
            onInterval,
            REFRESH_INTERVAL
        );
    };
    
    
    var main = function () {
        
        var ROOT_ID = 0;
        //chech that we are running as root
        if (process.getuid() !== ROOT_ID) {
            console.log("Script must be run as root.");
            process.exit(1);
        }
        
        loadAddressData(
            function () {
                loadNextAddress();
                resetInterval();
            },
            function (err) {
                //what should we do here?
                //right now we error and exit
                console.log("Error : main : cannot load adddress data. Aborting.");
                process.exit(1);
            }
        );
    };
    
    main();
    
}());
