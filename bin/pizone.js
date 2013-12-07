/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, process, console, clearInterval, setInterval */

(function () {
    "use strict";

    var FileSystem = require('fs');
    //nohup node simple-server.js > output.log &
    
    
    //file path to file containing JSON data of mac addresses
    var ADDRESS_DATA_PATH = "/etc/pizone/address.json";
    
    //interval in milliseconds that address will be rotated
    var REFRESH_INTERVAL = 1000 * 5; //1 minute
    
    var addresses = [];
    var intervalId;
    var index = 0;
    
    
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
                console.log("error");
            } else {
                try {
                    var _t = JSON.parse(data);
                    addresses = _t;
                    
                    //make sure it is an array
                    
                    if (Object.prototype.toString.call(addresses) !== "[object Array]") {
                        throw "Object not Array";
                    }
                    
                } catch (e) {
                    console.log("Error : Address data JSON is not in correct format.");
                    addresses = [];
                }
            }
            
            onSuccessCallback();
        });
    };
    
    var updateAddress = function () {
        if (!addresses.length) {
            index = 0;
            return;
        }
        
        var item = addresses[index];
        
        //check values in item to make sure they are valid
        //mac address is valid, and ssid is not null
        
        console.log(item);
        
        index++;
        
        if (index >= addresses.length) {
            index = 0;
        }
    };
    
    var onInterval = function () {
        updateAddress();
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
                updateAddress();
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