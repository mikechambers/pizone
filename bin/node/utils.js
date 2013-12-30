/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, process */

(function () {
    "use strict";

    var isValidMacAddress = function (address) {
        return !!address.match(/^([0-9A-F]{2}[:\-]){5}([0-9A-F]{2})$/g);
    };
    
	var celsiusToFarenheit = function (temp) {
		return (1.8 * temp) + 32;
	};

    var createValueHash = function (arr) {
        
        var len = arr.length;
        var i;
        
        var out = {};
        for (i = 0; i < len; i++) {
            out[arr[i]] = true;
        }
        
        return out;
    };
    
    exports.createValueHash = createValueHash;
	exports.celsiusToFarenheit = celsiusToFarenheit;
    exports.isValidMacAddress = isValidMacAddress;
    
}());