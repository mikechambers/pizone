/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, process */

(function () {
    "use strict";

    var isValidMacAddress = function (address) {
        return !!address.match(/^([0-9A-F]{2}[:\-]){5}([0-9A-F]{2})$/g);
    };
    
    exports.isValidMacAddress = isValidMacAddress;
    
}());