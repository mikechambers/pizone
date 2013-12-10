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
    
    var sendJSONResponse = function (response, obj) {
        response.writeHead(200, jsonHeader);
        response.write(objectToJson(obj));
        response.end();
    };
    
    /************** handlers ****************/
    
    var getInfo = function () {
        //todo: return all items, current item, current index, refresh interval, time in ms until next item
    };
    
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
    
    var handlers = {};
    handlers["/CURRENTADDRESS"] = getCurrentAddress;
    handlers["/ADDRESSES"] = getAddresses;
    handlers["/GETINFO"] = getInfo;
    
    exports.handlers = handlers;
}());