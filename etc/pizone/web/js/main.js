/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global window, $ */

(function () {
    "use strict";
    
    var Handlebars = window.Handlebars;
    
    Handlebars.registerHelper("getStatus", function (address, currentAddress) {
        if (address === currentAddress) {
            return "active";
        } else {
            return "";
        }
    });
    
    var formatTimeInterval = function (prop, propName) {
        var out = "";
        if (prop) {
            out += prop + " " + propName;
            
            if (prop !== 1) {
                out += "s";
            }
            out += " ";
        }
        
        return out;
    };
    
    var formatTime = function (ms) {

        //var milliseconds = parseInt((duration%1000)/100)
        var seconds = parseInt((ms / 1000) % 60, 10);
        var minutes = parseInt((ms / (1000 * 60)) % 60, 10);
        var hours = parseInt((ms / (1000 * 60 * 60)) % 24, 10);

        var out = "";
        out += formatTimeInterval(hours, "hour");
        out += formatTimeInterval(minutes, "minute");
        out += formatTimeInterval(seconds, "second");
        
        return out;
    };
    
    var main = function () {
                
        $.ajax({
            url: "/api/getinfo",
            cache: false,
            dataType : "json"
        }).done(function (data) {
            var currentItem = data.currentItem;

            $("#currentAddressSSID").text(currentItem.ssid);
            $("#currentAddressDescription").text(currentItem.description);
            $("#currentAddressMac").text(currentItem.address);
            
            var temp = "Not Available";
            if (data.systemInfo.cpuTemp) {
                temp = data.systemInfo.cpuTemp + " degrees " +  data.systemInfo.tempScale;
            }
            $("#currentCPUTemp").text(temp);
            

            $("#updateInterval").text("Every " + formatTime(data.config.refreshInterval));
            
            if (currentItem.timeSinceUpdate) {
                var _t = (data.config.refreshInterval - currentItem.timeSinceUpdate);

                $("#timeToNextAP").text(formatTime(_t));
            }
            
            var source = $("#ap-list-template").html();
            var apListTemplate = Handlebars.compile(source);
            var html = apListTemplate({"addresses": data.addresses, "currentAddress": currentItem.address});
            
            $("#ap-list-body").append(html);
        });
    };
    
    window.onload = main;
}());