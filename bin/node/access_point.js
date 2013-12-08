/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports */

(function () {
    "use strict";
    
    var config = require("./config.js");
    var child_process = require("child_process");

    var update = function (ssid, address, onSuccess, onError) {
        
        if (!address.match(/^([0-9A-F]{2}[:\-]){5}([0-9A-F]{2})$/g)) {
            onError("Invalid mac address");
            return;
        }
        
        if (!ssid || !ssid.length) {
            onError("Invalid SSID.");
            return;
        }
        
        //note, the arguments are not passed on the shell, so we don't have to worry
        //about injection (although the script being called does)
        //http://stackoverflow.com/questions/15168071/how-secure-is-using-execfile-for-bash-scripts
        var cmd = child_process.execFile(
            "cmac",
            [ssid, address],
            {timeout: config.PROCESS_TIMEOUT},
            function (err, stdout, stderr) {
                if (err) {
                    onError(err);
                } else {
                    onSuccess(stdout);
                }
            }
        );
        
        //note, exit is called before the callbacks before are called
        //so we use those to capture output and know when the process has exited
        /*
            cmd.on("exit", function (code) {
                console.log("cmd exit");
            });
        */
    };
    
    exports.update = update;
}());