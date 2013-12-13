/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, clearInterval, setInterval */

(function () {
    "use strict";

    var config = require("./config.js");
    var address_manager = require("./address_manager.js");
    var system = require("./system.js");

    var intervalId;
    
    var setAccessPoint = function (item) {
        
        console.log(new Date().toISOString() + " : " + item.description + " : " + item.address + " : " + item.ssid);

        if (config.TEST) {
            return;
        }
        
        system.updateAccessPoint(item.ssid, item.address,
            function (err, out) {
                if (err) {
                    console.log(err, out);
                    return;
                }
                console.log(out);
            });
    };
    
    var onInterval = function () {
        setAccessPoint(address_manager.getNextAddress());
    };
    
    var stop = function () {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = 0;
        }
    };
    
    var reset = function () {
        stop();
        
        intervalId = setInterval(
            onInterval,
            config.REFRESH_INTERVAL
        );
    };
    
    //note, right now, resume doesnt resume from the same time (although
    //it does resume from the same interval
    var resume = function () {
        reset();
    };
    
    var start = function () {
        reset();
        setAccessPoint(address_manager.getFirstAddress());
    };
    
    exports.resume = resume;
    exports.start = start;
    exports.reset = reset;
    
}());