/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, process */

(function () {
    "use strict";
    
    var argv = process.argv;
    var test = false;
    if (argv.length >= 3 && argv[2].toUpperCase() === "TEST") {
        test = true;
    }
    
    /***** Authentication *******/
    exports.REQUIRE_AUTHENTICATION = true;
    exports.AUTHENTICATION_REALM = "pizone";
    exports.SERVER_USERNAME = "pizone";
    exports.SERVER_PASSWORD = "pizone";
    
    exports.ACCESS_POINT_INTERFACE = "wlan0";
    
    exports.ENABLE_API_SERVICE = true;
    
	exports.USE_CELCIUS = false;

    exports.VERBOSE_OUTPUT = true;
    
    exports.HOSTAPD_CONF_PATH = "/etc/hostapd/hostapd.conf";
    exports.HOSTAPD_CONF_TEMPLATE_PATH = "/etc/pizone/hostapd.conf.template";
    exports.HOSTAPD_RESTRICTED_ADDRESSES_PATH = "/etc/hostapd/hostapd.access";
    
    //exports.API_PORT = 8080;
    exports.HTTP_PORT = 80;
    exports.HTTP_SERVER_ROOT = "/etc/pizone/web/";
    
    exports.API_BASE_PATH = "/api";
    
    //file path to file containing JSON data of mac addresses
    exports.ADDRESS_DATA_PATH = "/etc/pizone/addresses.json";
    
    //note : overriden below when in test mode
    exports.PRETTY_PRINT_JSON_RESPONSE = true;
    exports.JSON_PRETTY_PRINT_DELIMETER = "\t";
    
    //interval in milliseconds that address will be rotated
    exports.REFRESH_INTERVAL = 1000 * 60 * 10;//10 minutes
    if (test) {
        exports.REFRESH_INTERVAL = 1000 * 60 * 2;//2 seconds
        exports.PRETTY_PRINT_JSON_RESPONSE = true;
    }
    
    exports.TEST = test;
    
    //timeout interval when call external commands
    exports.PROCESS_TIMEOUT = 1000 * 30;
}());