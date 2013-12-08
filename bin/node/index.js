/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, console, process */

/* TODO

    -may want to use setTimeout and not setInterval
    so the next loop only starts once the previous execution has ended
    
*/

(function () {
    "use strict";

    var config = require("./config.js");
    var daemon = require("./daemon.js");
    var address_manager = require("./address_manager.js");
    
    var main = function () {
        
        if (config.TEST) {
            console.log("Running in test mode.");
        }
            
        
        var ROOT_ID = 0;
        
        //chech that we are running as root
        if (process.getuid() !== ROOT_ID) {
            console.log("Script must be run as root.");
            process.exit(1);
        }
        
        address_manager.load(
            function () {
                daemon.start();
            },
            function (err) {
                //what should we do here?
                //right now we error and exit
                console.log("Error : main : cannot load adddress data. Aborting.");
                process.exit(1);
            },
            true
        );
    };
    
    main();
    
}());
