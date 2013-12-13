/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, process */

(function () {
    "use strict";
    
    var child_process = require("child_process");
    var config = require("./config.js");
    
    var exec = function (processName, args, callback) {
        var cmd = child_process.execFile(
            processName,
            args,
            {timeout: config.PROCESS_TIMEOUT},
            function (err, stdout, stderr) {
                var out = stdout;
                if (err) {
                    out = stderr;
                }

                //note, if not error, err will be null
                callback(err, out);
            }
        );
    };
    
    exports.exec = exec;
    
}());