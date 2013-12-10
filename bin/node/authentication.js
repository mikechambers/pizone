/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, Buffer */

(function () {
    "use strict";
    
    var config = require("./config.js");
    
    var decodeAuthHeader = function (authHeader) {
        //code based on : http://stackoverflow.com/a/5957629
        var token = authHeader.split(/\s+/).pop() || '';         // and the encoded auth token
        var auth = new Buffer(token, 'base64').toString();// convert from base64
        var parts = auth.split(/:/);                        // split on colon
        
        var out = {
            username: parts[0],
            password: parts[1]
        };

        return out;
    };
    
    var validateCredentials = function (username, password) {
        return (username === config.SERVER_USERNAME &&
                password === config.SERVER_PASSWORD);
    };
    
    var sendNotAuthenticatedResponse = function (response) {
        // No Authorization header was passed / or passed in credentials were wrong in so it's the first time the browser hit us
        // Sending a 401 will require authentication, we need to send the 'WWW-Authenticate' to tell them the sort of authentication to use
        // Basic auth is quite literally the easiest and least secure, it simply gives back  base64( username + ":" + password ) from the browser
        //http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
        //code based on : https://gist.github.com/charlesdaniel/1686663
        response.statusCode = 401;
        response.setHeader("WWW-Authenticate", "Basic realm=\"" + config.AUTHENTICATION_REALM + "\"");
        response.end('<html><body>Not authenticated.</body></html>');
    };
    
    var isAuthenticatedRequest = function (request, response) {
        
        if (!config.REQUIRE_AUTHENTICATION) {
            return true;
        }
        
        var authHeader = request.headers.authorization;  // auth is in base64(username:password)  so we need to decode the base64
        
        var hasValidCredentials = false;
        if (authHeader) {
            var credentials = decodeAuthHeader(authHeader);
            hasValidCredentials = validateCredentials(credentials.username, credentials.password);
        }
        
        if (!hasValidCredentials) {
            return false;
        }
    
        return true;
    };
    
    var checkAndHandleAuthentication = function (request, response) {
        if (!isAuthenticatedRequest(request)) {
            console.log("Invalid authentication : ", request.headers, request.url, request.method, request.statusCode);
            sendNotAuthenticatedResponse(response);
            return false;
        }
        
        return true;
    };
    
    exports.checkAndHandleAuthentication = checkAndHandleAuthentication;
    exports.decodeAuthHeader = decodeAuthHeader;
    exports.validateCredentials = validateCredentials;
    exports.sendNotAuthenticatedResponse = sendNotAuthenticatedResponse;
    exports.isAuthenticatedRequest = isAuthenticatedRequest;
    
}());