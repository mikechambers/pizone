/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, process */

(function () {
    "use strict";
    
    var config = require("./config.js");
    var fs = require("fs");
    var winston = require("./logger").winston;
    var os = require("os");
    
    var items;
    
    var removeItem = function (macaddress, callback) {
    };
    
    var removeItems = function (macaddresses, callback) {
    };
    
    var addItem = function (macaddress, callback) {
    };
    
    var writeAccessList = function (items, callback) {
    };
    
    var getItems = function (callback) {
        
        if (config.CACHE_CONF_FILES && items) {
            callback(null, items);
            return;
        }
        
        fs.exists(config.RESTRICTED_ADDRESSES_PATH, function (exists) {
            
            if (!exists) {
                winston.info("RESTRICTED_ADDRESSES_PATH does not exist. Using default empty list. : " +
                             config.RESTRICTED_ADDRESSES_PATH);
                
                var _tmp = [];
                if (config.CACHE_CONF_FILES) {
                    items = _tmp;
                }
                    
                callback(null, _tmp);
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
                    
                    if (config.CACHE_CONF_FILES) {
                        items = _items;
                    }
                    
                    callback(null, _items);
                }
                );
        });
    };
    
    exports.removeItem = removeItem;
    exports.addItem = addItem;
    exports.getItems = getItems;
}());