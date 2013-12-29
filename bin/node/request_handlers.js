/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports */

(function () {
    "use strict";
    
    var address_manager = require("./address_manager.js");
    var config = require("./config.js");
    var system = require("./system.js");
    var daemon = require("./daemon.js");
    var winston = require("./logger").winston;
    
    var jsonHeader = {"Content-Type": "application/json"};
    
    var objectToJson = function (obj) {
        
        if (obj === null || obj === undefined) {
            return "";
        }
        
        var out;
        
        if (config.PRETTY_PRINT_JSON_RESPONSE) {
            out = JSON.stringify(obj, null, config.JSON_PRETTY_PRINT_DELIMETER);
        } else {
            out = JSON.stringify(obj);
        }
        
        return out;
    };
    
    var generateError = function (msg) {
        var out = {"error": msg};
        return out;
    };
    
    var sendJSONResponse = function (response, obj) {
        response.writeHead(200, jsonHeader);
        response.write(objectToJson(obj));
        response.end();
    };
    
    /************** handlers ****************/

    
    var getCurrentAddress = function (response) {
        var item = address_manager.getCurrentAddress();
        
        var out = item;
        if (!item) {
            out = generateError("No current address.");
        }
        
        sendJSONResponse(response, out);
    };
    
    var getAddresses = function (response) {
        var items = address_manager.getAddresses();
        
        sendJSONResponse(response, items);
    };
    
    var getLogs = function (response) {
        
        var options = {
            from: new Date() - 24 * 60 * 60 * 1000,
            until: new Date(),
            limit: 10,
            start: 0,
            order: 'desc'
            //fields: ['message']
        };
        
        //
        // Find items logged between today and yesterday.
        //
        winston.query(options, function (err, results) {
            if (err) {
                console.log("error", err);
                throw err;
            }
        
            console.log(results);
            sendJSONResponse(response, {"logs": "Hi im a log"});
        });
    };
    
    var getInfo = function (response) {
        //todo: return all items, current item, current index, refresh interval, time in ms until next item
        
        var out = {};
        
        out.currentItem = address_manager.getCurrentAddress();
        
        
        //return (new Date()).getTime() - lastUpdated.getTime();
        
        var _d = daemon.getLastUpdated();
        
        if (_d) {
            out.currentItem.timeSinceUpdate = (new Date()).getTime() - _d.getTime();
        }
        
        out.addresses = address_manager.getAddresses();
        
        system.getCPUTemp(
            function (err, temp) {
                out.systemInfo = {};
                if (!err) {
                    out.systemInfo = temp;
                }
                
                var c = {
                    "refreshInterval" : config.REFRESH_INTERVAL,
                    "isTestMode" : config.TEST
                };
                
                out.config = c;
                
                //refreshInterval
                //timeToRefresh
                
                sendJSONResponse(response, out);
            }
        );
    };
    
    var handlers = {};
    handlers["/CURRENTADDRESS"] = getCurrentAddress;
    handlers["/ADDRESSES"] = getAddresses;
    handlers["/GETINFO"] = getInfo;
    handlers["/GETLOGS"] = getLogs;
    
    exports.handlers = handlers;
}());