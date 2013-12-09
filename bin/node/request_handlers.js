/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports */

(function () {
    "use strict";
    
    var address_manager = require("./address_manager.js");
    var config = require("./config.js");
    
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
    
    var getCurrentAddress = function (response) {
        response.writeHead(200, jsonHeader);
        
        var item = address_manager.getCurrentAddress();
        
        var out = item;
        if (!item) {
            out = generateError("No current address.");
        }
        
        response.write(objectToJson(out));
        response.end();
    };
    
    var getAddresses = function (response) {
        response.writeHead(200, jsonHeader);
        
        var items = address_manager.getAddresses();
        
        response.write(objectToJson(items));
        response.end();
    };
    
    var handlers = {};
    handlers["/CURRENTADDRESS"] = getCurrentAddress;
    handlers["/ADDRESSES"] = getAddresses;
    
    exports.handlers = handlers;
}());