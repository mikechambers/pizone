/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, process, console, clearInterval, setInterval */

/* TODO

    -may want to use setTimeout and not setInterval
    so the next loop only starts once the previous execution has ended
    
*/

(function () {
    "use strict";

    var config = require("./config.js");
    var address_manager = require("./address_manager.js");
    
    var child_process = require("child_process");
    //nohup node simple-server.js > output.log &
    
    //var addresses = [];
    var intervalId;
    var index = 0;
    
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
        var cmd = child_process.execFile(
            "cmac",
            [ssid, address],
            {timeout: config.PROCESS_TIMEOUT},
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
    
    var setAccessPoint = function (item) {
        //check values in item to make sure they are valid
        //mac address is valid, and ssid is not null
        
        //var item = address_manager.getNextAddress();
        
        console.log(new Date().toISOString() + " : " + item.description + " : " + item.address + " : " + item.ssid);
        //need to escape
        
        updateAddress(item.address, item.ssid,
            function () {
                //incrementIndex();
            },
            function (err) {
                console.log("Error setting address:");
                console.log(err);
                //incrementIndex();
            });
    };
    
    var onInterval = function () {
        setAccessPoint(address_manager.getNextAddress());
    };
    
    var resetInterval = function () {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = 0;
        }
        
        intervalId = setInterval(
            onInterval,
            config.REFRESH_INTERVAL
        );
    };
    
    
    var main = function () {
        
        var ROOT_ID = 0;
        //chech that we are running as root
        if (process.getuid() !== ROOT_ID) {
            console.log("Script must be run as root.");
            process.exit(1);
        }
        
        address_manager.load(
            function () {
                setAccessPoint(address_manager.getFirstAddress());
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
