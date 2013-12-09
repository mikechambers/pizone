/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, process */

(function () {
    "use strict";
    
    var argv = process.argv;
    var test = false;
    if (argv.length >= 3 && argv[2].toUpperCase() === "TEST") {
        test = true;
    }
    
    //file path to file containing JSON data of mac addresses
    exports.ADDRESS_DATA_PATH = "/etc/pizone/addresses.json";
    
    //interval in milliseconds that address will be rotated
    exports.REFRESH_INTERVAL = 1000 * 60 * 10;//10 minutes
    if (test) {
        exports.REFRESH_INTERVAL = 1000 * 2;//2 seconds
    }
    
    exports.TEST = test;
    
    //timeout interval when call external commands
    exports.PROCESS_TIMEOUT = 1000 * 30;
    
}());