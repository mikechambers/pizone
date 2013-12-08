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
    var access_point = require("./access_point.js");
    
    var intervalId;
    
    var setAccessPoint = function (item) {
        
        console.log(new Date().toISOString() + " : " + item.description + " : " + item.address + " : " + item.ssid);
        //need to escape
        
        access_point.update(item.ssid, item.address,
            function (stdout) {
                if (stdout) {
                    console.log(stdout);
                }
            },
            function (err) {
                console.log("Error setting address:");
                console.log(err);
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
            },
            true
        );
    };
    
    main();
    
}());
