/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global window, $ */

(function () {
    "use strict";
    
    var main = function () {
        console.log("loaded");
        
        $.ajax({
            url: "/api/getinfo",
            cache: false,
            dataType : "json"
        }).done(function (data) {
            var currentItem = data.currentItem;
            console.log(currentItem);
            $("#currentAddressSSID").text(currentItem.ssid);
            $("#currentAddressDescription").text(currentItem.description);
            $("#currentAddressMac").text(currentItem.address);
            
            var temp = "Not Available";
            if (data.systemInfo.cpuTemp) {
                temp = data.systemInfo.cpuTemp + " degrees " +  data.systemInfo.tempScale;
            }
            $("#currentCPUTemp").text(temp);
            
        });
    };
    
    window.onload = main;
}());