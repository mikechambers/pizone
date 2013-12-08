/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports */

(function () {
    "use strict";
    
    var fs = require("fs");
    var config = require("./config.js");
    var addresses = [];
    var index = 0;
    
    /**
     * Randomize array element order in-place.
     * Using Fisher-Yates shuffle algorithm.
     */
    var shuffleArray = function (arr) {
        
        if (!arr || !arr.length) {
            return;
        }
        
        var i;
        for (i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    };
    
    var getAddressAtIndex = function (index) {
        if (!addresses || !addresses.length) {
            return null;
        }
        
        //todo : check that it is valid index?
        return addresses[index];
    };
    
    var getCurrentAddress = function () {
        return getAddressAtIndex(index);
    };
    
    var getFirstAddress = function () {
        if (!addresses || !addresses.length) {
            return null;
        }
        
        //todo : check that it is valid index?
        return getAddressAtIndex(0);
    };
    
    var getNextAddress = function () {
        if (!addresses || !addresses.length) {
            index = 0;
            return null;
        }
        
        index++;
        
        if (index >= addresses.length) {
            index = 0;
        }
        
        var item = addresses[index];
        
        return item;
    };
    
    var load = function (onSuccessCallback, onErrorCallback, shuffle) {
        
        fs.readFile(config.ADDRESS_DATA_PATH, 'utf8', function (err, data) {
            
            if (err) {
                console.log("loadAddressData");
                console.log(err);
                onErrorCallback(err);
                return;
            }
    
            if (!data) {
                //right now, we fail silently if there is no data (i.e. empty string)
                //maybe we should fail and exit?
                console.log("error");
            } else {
                try {
                    addresses = JSON.parse(data);
                    
                    //make sure it is an array
                    if (Object.prototype.toString.call(addresses) !== "[object Array]") {
                        throw "Object not Array";
                    }
                    
                } catch (e) {
                    console.log("Error : Address data JSON is not in correct format.");
                    addresses = [];
                }
            }

            if (shuffle) {
                shuffleArray(addresses);
            }
            
            onSuccessCallback(addresses);
        });
    };
    
    exports.getNextAddress = getNextAddress;
    exports.getFirstAddress = getFirstAddress;
    exports.load = load;
}());