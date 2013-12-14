/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports */

(function () {
    "use strict";

    var config = require("./config.js");
    var node_static = require("node-static");
    var http = require("http");
    var authentication = require("./authentication.js");
    var url = require("url");
    var winston = require("./logger").winston;
    
    var server;
    
    var start = function (route, handle) {

        var fileServer = new node_static.Server(config.HTTP_SERVER_ROOT);

        server = http.createServer(
            function (request, response) {
                
                if (!authentication.checkAndHandleAuthentication(request, response)) {
                    return;
                }
                
                var pathname = url.parse(request.url).pathname;
                
                //console.log(pathname, );
                
                if (pathname.indexOf(config.API_BASE_PATH) === 0) {
                    var apiName = pathname.substr(config.API_BASE_PATH.length);
                    route(handle, apiName, response);
                } else {
                    request.addListener('end',
                        function () {
                            fileServer.serve(request, response, function (e, res) {
                                if (e && e.status === 404) {
                                    fileServer.serveFile('/404.html', 404, {}, request, response);
                                }
                            });
                        }).resume();
                }
            }
        );
        server.listen(config.HTTP_PORT);
        winston.info("pizone HTTP server initialized. Listening on port " + config.HTTP_PORT);
        
    };

    exports.start = start;
}());