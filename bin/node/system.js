/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports */

(function () {
    "use strict";
    
    var async = require("async");
    var process_runner = require("./process_runner.js");
    var config = require("./config.js");
    var utils = require("./utils.js");
    var fs = require("fs");
    
    var restartUDHCPD = function (callback) {
        //service udhcpd restart 2>&1 >/dev/null
        process_runner.exec("service", ["udhcpd", "restart"], callback);
    };

    var restartAPD = function (callback) {
        //service hostapd restart 2>&1 >/dev/null
        process_runner.exec("service", ["hostapd", "restart"], callback);
    };
    
    var loadAPConf = function (callback) {
        fs.readFile(config.HOSTAPD_CONF_TEMPLATE_PATH, callback);
    };
    
    var writeAPConf = function (data, callback) {
        fs.writeFile(config.HOSTAPD_CONF_PATH, callback);
    };
    
    var updateAPConf = function (ssid, callback) {
        //template=$(<$HOSTAPD_CONF_TEMPLATE);
        //echo "${template/$SSID_TOKEN/$SSID}" > "$HOSTAPD_CONF"    
    };
    
    var updateAccessPoint = function (ssid, address, callback) {
        
        if (!utils.isValidMacAddress(address)) {
            callback("Invalid mac address");
            return;
        }
        
        if (!ssid || !ssid.length) {
            callback("Invalid SSID.");
            return;
        }
        
        //note, the arguments are not passed on the shell, so we don't have to worry
        //about injection (although the script being called does)
        //http://stackoverflow.com/questions/15168071/how-secure-is-using-execfile-for-bash-scripts
        async.series(
            [
                function (callback) {process_runner.exec("ifconfig", [config.ACCESS_POINT_INTERFACE, "down"], callback); },
                function (callback) {process_runner.exec("ifconfig", [config.ACCESS_POINT_INTERFACE, "hw", "ether", address], callback); },
                function (callback) {process_runner.exec("ifconfig", [config.ACCESS_POINT_INTERFACE, "up"], callback); },
                function (callback) {updateAPConf(ssid, callback); },
                function (callback) {restartAPD(callback); },
                function (callback) {restartUDHCPD(callback); }
            ],
            function (err, out) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, out);
            }
        );
    };
    
    exports.updateAccessPoint = updateAccessPoint;
}());