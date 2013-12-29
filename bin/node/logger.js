/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, exports, process */

(function () {
    "use strict";
    
    var winston = require("winston");
    var util = require("util");
    var config = require("./config.js");
    var moment = require("moment");
    
    var getTimeStamp = function () {
        return moment().format(config.TIMESTAMP_FORMAT);
    };
    
    var MemoryLogger = winston.transports.CustomerLogger = function (options) {
        //
        // Name this logger
        //
        this.name = 'memoryLogger';
        
        //
        // Set the level from your options
        //
        
        if (options && options.level) {
            this.level = options.level || 'info';
        }
        
        this.maxitems = 500;
        if (options && options.maxitems) {
            this.maxitems = options.maxitems;
        }
        
        //
        // Configure your storage backing as you see fit
        //
        
        this.logArr = [];
    };
    
    //
    // Inherit from `winston.Transport` so you can take advantage
    // of the base functionality and `.handleExceptions()`.
    //
    util.inherits(MemoryLogger, winston.Transport);
    
    MemoryLogger.prototype.query = function (options, callback) {
        callback(null, this.logArr);
    };
    
    MemoryLogger.prototype.log = function (level, msg, meta, callback) {
    //
    // Store this message and metadata, maybe use some custom logic
    // then callback indicating success.
    //
        
        this.logArr.push(getTimeStamp() + " " + level + " " + msg);
        
        var diff = this.maxitems - this.logArr.length;
        
        if (diff < 0) {
            this.logArr.splice(0, diff * -1);
        }
        
        
        callback(null, true);
    };

    var logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({"timestamp": function () {
                return getTimeStamp();
            }}),
            new MemoryLogger({maxitems: config.MAX_LOG_ITEMS})
        ]
    });

    exports.winston = logger;
}());