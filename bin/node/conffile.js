/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, Buffer */

(function () {
    "use strict";
    
    var os = require("os");
    
    var lineIsPropValue = function (property, line) {
        return (line.indexOf(property + " ") === 0 || line.indexOf(property + "=") === 0);
    };
    
    var getConfProperty = function (property, confFileContent) {
        var confArr = confFileContent.split(os.EOL);
        
        var len = confArr.length;
        var i;
        var line;
        
        //loop through each line of the conf file, looking for the 
        //one that specifies the ssid
        for (i = 0; i < len; i++) {
            line = confArr[i];
            
            //see if lines starts with "ssid " or "ssid="
            if (lineIsPropValue(property, line)) {
                var _tmp = line.split("=");
                
                if (_tmp.length === 2) {
                    //todo: this will return the wrong value if the property value also contains a "=" char.
                    return _tmp[1].trim();
                }
            }
        }
        
        //if we don't find the property, return null
        return null;
    };
    
    var updateConfProperty = function (property, value, confFileContent) {
        var confArr = confFileContent.split(os.EOL);
        
        var len = confArr.length;
        var i;
        var line;
        var found = false;
        
        //loop through each line of the conf file, looking for the 
        //one that specifies the ssid
        for (i = 0; i < len; i++) {
            line = confArr[i];
            
            //see if lines starts with "ssid " or "ssid="
            if (lineIsPropValue(property, line)) {
                
                //if so, rewrite line to specify the new ssid
                confArr[i] = property + "=" + value;
                
                //note, we don't stop looping in case the ssid is specified multiple
                //times for some reason
                found = true;
            }
        }
        
        //if for some reason, the conf file doesnt specify the ssid
        //we add it at the end
        if (!found) {
            confArr.push(property + "=" + value);
        }
        
        //create a return a string of the conf file.
        var out = confArr.join(os.EOL);
        return out;
    };
    
    var removeConfProperty = function (property, confFileContent) {
        var confArr = confFileContent.split(os.EOL);
        
        var len = confArr.length;
        var i;
        var line;
        
        //loop through each line of the conf file, looking for the 
        //one that specifies the ssid
        for (i = 0; i < len; i++) {
            line = confArr[i];
            
            //see if lines starts with "ssid " or "ssid="
            if (lineIsPropValue(property, line)) {
                confArr.splice(i, 1);
                break;
            }
        }
        
        //create a return a string of the conf file.
        var out = confArr.join(os.EOL);
        return out;
    };
    
    exports.removeConfProperty = removeConfProperty;
    exports.updateConfProperty = updateConfProperty;
    
}());