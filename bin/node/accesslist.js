/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, process */

(function () {
    "use strict";
    
    var config = require("./config.js");
    var fs = require("fs");
    var winston = require("./logger").winston;
    var os = require("os");
    var utils = require("./utils.js");

    var getItems = function (callback) {

        fs.exists(config.RESTRICTED_ADDRESSES_PATH, function (exists) {
            
            if (!exists) {
                winston.info("RESTRICTED_ADDRESSES_PATH does not exist. Using default empty list. : " +
                             config.RESTRICTED_ADDRESSES_PATH);
                    
                callback(null, []);
                return;
            }
            
            fs.readFile(config.RESTRICTED_ADDRESSES_PATH, {encoding: "utf8"},
                function (err, data) {
                    if (err) {
                        //file exists but we cant read it for some reason
                        winston.error("Error reading restriction list.");
                        callback(err);
                        return;
                    }
                    
                    var _items = data.split(os.EOL);
                    var len = _items.length;
                    var i;
                    
                    for (i = 0; i < len; i++) {
                        _items[i] = _items[i].trim();
                    }
                    
                    callback(null, _items);
                }
                );
        });
    };
        
    var writeAccessList = function (macaddresses, callback) {
        //write array to file.
        //if success and we need to cache, then cache files
        //return items in callback
        
        var data = macaddresses.join(os.EOL);
        
        fs.writeFile(config.RESTRICTED_ADDRESSES_PATH, data, function (err, out) {
            callback(err, macaddresses);
        });
    };
    
    var _removeItems = function (macaddresses, _items, callback) {
        var hash = utils.createValueHash(macaddresses);
        var len = _items.length;
        var i;
        
        var out = [];
        
        for (i = 0; i < len; i++) {
            
            if (!hash[_items[0]]) {
                out.push(_items[0]);
            }
        }
        
        writeAccessList(out, callback);
    };
    
    var removeItems = function (macaddresses, callback) {
        getItems(
            function (err, _items) {
                
                if (err) {
                    callback(err);
                    return;
                }
                
                _removeItems(macaddresses, _items, callback);
            }
        );
        
    };
    
    var _addItems = function (macaddresses, _items, callback) {
        
        var hash = utils.createValueHash(_items);
        var len = macaddresses.length;
        var i;
        
        var out = _items;
        
        for (i = 0; i < len; i++) {
            
            if (!hash[macaddresses[0]]) {
                out.push(macaddresses[0]);
            }
        }
        
        writeAccessList(out, callback);
    };
    
    var addItems = function (macaddresses, callback) {
        
        getItems(
            function (err, _items) {
                
                if (err) {
                    callback(err);
                    return;
                }
                
                _addItems(macaddresses, _items, callback);
            }
        );
    };
    

    exports.removeItems = removeItems;
    exports.addItems = addItems;
    exports.getItems = getItems;
}());