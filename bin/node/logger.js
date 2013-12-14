/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, process */

(function () {
    "use strict";
    
    var winston = require("winston");
    var logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({"timestamp": function () {
                return new Date().toString();
            }})
        ]
    });
    
    exports.winston = logger;
}());