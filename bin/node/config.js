/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports */

(function () {
    "use strict";

    //file path to file containing JSON data of mac addresses
    exports.ADDRESS_DATA_PATH = "/etc/pizone/address.json";
    
    //interval in milliseconds that address will be rotated
    exports.REFRESH_INTERVAL = 1000 * 60 * 10; //10 minutes
    
    //timeout interval when call external commands
    exports.PROCESS_TIMEOUT = 1000 * 30;
}());