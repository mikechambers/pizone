/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global window, $ */

(function () {
    "use strict";
    
    var main = function () {
        
        var Handlebars = window.Handlebars;
        
        Handlebars.registerHelper("getStatus", function(address, currentAddress ) {
            if(address == currentAddress)
            {
                return "active";
            } else {
                return "";
            }
        });        
        
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
            
            if(currentItem.timeSinceUpdate) {
                $("#timeToNextAP").text((data.config.refreshInterval - currentItem.timeSinceUpdate) + " ms");
            }
            
            var source = $("#ap-list-template").html();
            var apListTemplate = Handlebars.compile(source); 
            var html = apListTemplate({"addresses":data.addresses, "currentAddress": currentItem.address});
            
             $("#ap-list-body").append(html);
        });
    };
    
    window.onload = main;
}());