/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports */

(function () {
    "use strict";
    
    var route = function (handle, pathname, response) {
        console.log("Route request received : " + pathname);
        
        pathname = pathname.toUpperCase();
        if (typeof handle[pathname] === "function") {
            handle[pathname](response);
        } else {
            console.log("No request handlers found for " + pathname);
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found.");
            response.end();
        }
    };
    
    exports.route = route;
    
}());