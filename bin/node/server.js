/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports */

(function () {
    "use strict";

    var http = require("http");
    var config = require("./config.js");
    var url = require("url");
    var authentication = require("./authentication.js");
    var winston = require("./logger").winston;
    
    var server;
    
    var start = function (route, handle) {
        server = http.createServer(
            function (request, response) {
                
                if (!authentication.checkAndHandleAuthentication(request, response)) {
                    return;
                }
                
                var pathname = url.parse(request.url).pathname;
                route(handle, pathname, response);
                winston.info("Request received : " + pathname);
            }
        
        );
        server.listen(config.API_PORT);
        
        winston.info("pizone API service initialized. Listening on port " + config.API_PORT);
    };
    
    var stop = function (onClose) {
        
        if (!server) {
            //should we call onClose here?
            onClose();
            return;
        }
        
        server.close(
            function () {
                server = null;
                onClose();
            }
        );
    };
    
    exports.stop = stop;
    exports.start = start;
}());