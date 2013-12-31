/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global window, $, setInterval, clearInterval, setTimeout */

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
    
    var displayErrorMessage = function (msg) {
        $("#errorField").text(msg);
        $(".alert").show();
    };
    
    var hasErrorAndHandle = function (data) {
        
        if (!data.error) {
            return false;
        }
        
        displayErrorMessage(data.error);
        
        return true;
    };
    
    var loadMainInfo = function () {
        $.ajax({
            url: "/api/getinfo",
            cache: false,
            dataType : "json"
        }).fail(function (jqXHR, textStatus) {
            displayErrorMessage("Error loading data.");
        }).done(function (data) {
            
            if (hasErrorAndHandle(data)) {
                //note : if an error occurs here, the interval stops and
                //we won't automatically check again. Need to figure out how
                //to handle this
                return;
            }
            
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

                var intervalCount = 0;
                var intervalId = setInterval(
                    function () {
                        intervalCount++;
                        
                        var tLeft = _t - intervalCount * 1000;
                        
                        if (tLeft <= 0) {
                            clearInterval(intervalId);
                            loadMainInfo();
                            return;
                        }
                        
                        $("#timeToNextAP").text(formatTime(tLeft));
                    },
                    1000
                );
                
                $("#timeToNextAP").text(formatTime(_t));
            }
            
            var source = $("#ap-list-template").html();
            
            //todo: cache this
            var apListTemplate = Handlebars.compile(source);
            
            
            var html = apListTemplate({"addresses": data.addresses, "currentAddress": currentItem.address});
            
            $("#ap-list-body").empty();
            $("#ap-list-body").append(html);
        });
    };
    
    var loadAccessInfo = function () {
        
        $.ajax({
            url: "/api/getaccessinfo",
            cache: false,
            dataType : "json"
        }).fail(function (jqXHR, textStatus) {
            displayErrorMessage("Error loading data.");
        }).done(function (data) {
            
            if (hasErrorAndHandle(data)) {
                return;
            }
            
            var addresses = data.restrictedAccessList;
            
            $("#restrictAccessCheckBox").prop("checked", Boolean(data.accessRestrictionEnable));
            
            if (addresses.length) {
                var source = $("#restrict-address-template").html();
                
                //todo: cache this
                var restrictedTemplate = Handlebars.compile(source);
                
                var html = restrictedTemplate({"addresses": data.restrictedAccessList});
                $("#restrict-address-body").empty();
                $("#restrict-address-body").append(html);
            }
        });
    };
    
    var loadLogFiles = function () {
        
        var btn = $("#logRefreshButton");
        btn.button('loading');
        
        $.ajax({
            url: "/api/getlogs",
            cache: false,
            dataType : "json"
        }).fail(function (jqXHR, textStatus) {
            displayErrorMessage("Error loading data.");
        }).done(function (data) {
            
            if (hasErrorAndHandle(data)) {
                btn.button('reset');
                return;
            }
                        
            //this puts an atificial delay on it, so the button doesnt
            //flash / twitch super fast
            setTimeout(function () {
                btn.button('reset');
                
                var logs = data.logs;
                
                if (!logs) {
                    return;
                }
    
                var field = $("#logfield");
                field.text(logs.join("\n"));
                
                field.scrollTop(
                    field[0].scrollHeight - field.height()
                );
                
            }, 250);
        });
    };
    
    var main = function () {
        
        $(".alert").hide();
        
        $("#alertCloseButton").click(
            function () {
                $(".alert").hide();
            }
        );
        
        $("#logRefreshButton").click(
            function () {
                loadLogFiles();
            }
        );
        
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.target === $("#logButton")[0]) {
                loadLogFiles();
            } else if (e.target === $("#configButton")[0]) {
                loadAccessInfo();
            }
        });
        
        loadMainInfo();
    };
    
    window.onload = main;
}());