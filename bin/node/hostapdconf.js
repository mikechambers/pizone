/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, process */

(function () {
    "use strict";
    var config = require("./config.js");
    var fs = require("fs");
    var conffile = require("./conffile.js");
    
    var apConfFileContent;
    
    /*
        loads hostapd.conf file into memory
        Once file is loaded, is is stored in memory
        and not reloaded again until pizone is restarted.
        
        Caching can be disabled by setting the
        CACHE_CONF_FILES variable in config.js
    */
    var loadConfFile = function (callback) {
        
        if (config.CACHE_CONF_FILES && apConfFileContent) {
            callback(null, apConfFileContent);
            return;
        }
        
        fs.readFile(config.HOSTAPD_CONF_PATH, {encoding: "utf8"},
            function (err, data) {
                if (err) {
                    callback(err);
                    return;
                }
                
                if (!data || !data.length) {
                    callback("Error loading hostapd.conf file. File was empty. " + config.HOSTAPD_CONF_PATH);
                    //todo : we might want to do a system exit here
                    return;
                }
                
                if (config.CACHE_CONF_FILES) {
                    apConfFileContent = data;
                }
                
                callback(null, data);
            }
            );
    };
        
    var updateAccessRestriction = function (enable, confFileContent) {
        
        var out;
        
        if (enable) {
            out = conffile.updateConfProperty("macaddr_acl", "1", confFileContent);
        } else {
            out = conffile.removeConfProperty("macaddr_acl");
        }
        
        return out;
    };
    
    var updateSSID = function (ssid, confFileContent) {
        return conffile.updateConfProperty("ssid", ssid, confFileContent);
    };
    
    var writeConfFile = function (data, callback) {
        
        fs.writeFile(config.HOSTAPD_CONF_PATH, data, function (err, out) {
            
            if (config.CACHE_CONF_FILES) {
                apConfFileContent = data;
            }
            
            callback(err, out);
        });
    };
    
    exports.updateSSID = updateSSID;
    exports.writeConfFile = writeConfFile;
    exports.updateAccessRestriction = updateAccessRestriction;
    exports.loadConfFile = loadConfFile;
}());