$(function() {
    function WiFiStatusViewModel(parameters) {
        var self = this;
        // Set link the parameters
        self.settingsViewModel = parameters[0];


        // Different SVG icons definiton
        self._svgPrefix = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/>';
        self._iconSVGs = [
            '<path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/>',
            '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>',
            '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"/>',
            '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M4.79 12.52l7.2 8.98H12l.01-.01 7.2-8.98C18.85 12.24 16.1 10 12 10s-6.85 2.24-7.21 2.52z"/>',
            '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M6.67 14.86L12 21.49v.01l.01-.01 5.33-6.63C17.06 14.65 15.03 13 12 13s-5.06 1.65-5.33 1.86z"/>',
            '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/>',
        ];
        self._svgPostFix = '</svg>';

        // Font awesome designs
        self.fontAI = [
            '<span class="fa-stack fa-1x"><i class="muted fas fa-wifi fa-stack-1x"></i><i class="text-error fas fa-exclamation fa-stack-1x"></i></span>',
            '<i class="fas fa-wifi q1"></i>',
            '<i class="fas fa-wifi q2"></i>',
            '<i class="fas fa-wifi q3"></i>',
            '<i class="fas fa-wifi q4"></i>',
            '<i class="fas fa-wifi q5"></i>'
        ];

        // Auto update the content
        self.iconData = ko.observable(self._svgPrefix + self._iconSVGs[0]);
        self.wifiData = ko.observableArray([]);

        // Set the source
        self.iconSrc = self._iconSVGs;
        self._iconPrefix = self._svgPrefix;
        self._iconPostfix = self._svgPostFix;

        // Init the UI and the click handler for the detailed view
        self.onAllBound = function() {
            // Set icon src to font awesome or not
            if (OctoPrint.coreui.viewmodels.settingsViewModel.settings.plugins.wifistatus.userFontAwesome()){
                self.iconSrc = self.fontAI;
                self._iconPrefix = '';
                self._iconPostfix = '';
                // Loading icon
                var newIconData = '<span class="fa-stack fa-1x"><i class="muted fas fa-wifi fa-stack-1x"></i><i class="fas fa-question fa-stack-1x"></i></span>';
            }else{
                // Loading icon
                var newIconData = self._iconPrefix + self.iconSrc[0] + self._iconPostfix;
            }
            // Initial loader
            var newWifiData = [{
                item: "Status",
                text: '<div class="text-center"><i class="fas fa-spinner fa-spin"></i>&nbsp;Loading...</div>'
            }];
            // Assign it all
            self.iconData(newIconData);
            self.wifiData(newWifiData);

            // Click handler
            $('#navbar_plugin_wifistatus_link').popover({
                'html': true,
                'placement': 'bottom',
                'container': 'body',
                'title': function(){return 'WiFi status <div class="navbar_plugin_wifistatus_titleIcon pull-right">'+self.iconData()+'</div>'},
                'trigger': OctoPrint.coreui.viewmodels.settingsViewModel.settings.plugins.wifistatus.popoverTrigger(),
                'content': function() {
                    return $('#navbar_plugin_wifistatus_content').html()
                }
            });
        };

        // Callback from the
        self.onDataUpdaterPluginMessage = function(plugin, data) {
            // Not us?
            if (plugin != "wifistatus") {
                return;
            }

            // Setup Icon
            var newIconData = self._iconPrefix;

            // Start building data
            var newWifiData;

            // Failure/Nothing found
            if (!data.interface) {
                // Set offline icon
                newIconData += self.iconSrc[0];

                // Set status text
                newWifiData = [{
                    item: "Status",
                    text: 'No connection'
                }];
                // Apply error message if present
                if (data.hasOwnProperty('errormsg')) {
                    newWifiData.push({
                        item: 'Error',
                        text: data.errormsg
                    });
                }
                // Update the data and the open UI
                self.iconData(newIconData+self._iconPostfix);
                self.wifiData(newWifiData);
                if ($('div.popover .navbar_plugin_wifistatus_contentinner:visible')){
                    $('div.popover .navbar_plugin_wifistatus_contentinner').parent().html($('#navbar_plugin_wifistatus_content').html());
                    $('div.navbar_plugin_wifistatus_titleIcon').html(self.iconData());
                }
                return true;
            }

            // We got data - lets build the data for the UI
            quality = Math.round((data.qual / data.qual_max) * 100);
            if (quality > 80) newIconData += self.iconSrc[1];
            else if (quality > 60) newIconData += self.iconSrc[2];
            else if (quality > 40) newIconData += self.iconSrc[3];
            else if (quality > 20) newIconData += self.iconSrc[4];
            else newIconData += self.iconSrc[5];

            // Main data
            newWifiData = [
                {
                    item: "Interface",
                    text: data.interface
                },
                {
                    item: "ESSID",
                    text: data.essid
                },
                {
                    item: "Quality",
                    text: data.qual + "/" + data.qual_max + " (" + quality +"%)",
                },
                {
                    item: "Bitrate",
                    text: data.bitrate
                },
                {
                    item: "Signal",
                    text: data.signal + "dBm"
                },
            ];
            // Noise found
            if (data.noise != 0){
                newWifiData.push({
                    item: "Noise",
                    text: data.noise + "dBm"
                });
            }
            // frequency found
            if (data.frequency){
                newWifiData.push({
                    item: "Frequency",
                    text: data.frequency
                });
            }
            // BSSID found
            if (data.bssid){
                newWifiData.push({
                    item: "BSSID",
                    text: data.bssid
                });
            }
            // Add ip adresses
            if (data.ipv4addrs) {
                if (data.ipv4addrs.length > 0) {
                    newWifiData.push({
                        item: "IPV4",
                        text: data.ipv4addrs.join("<br/>")
                    })
                }
            }
            // Add ipv6 addresses
            if (data.ipv6addrs) {
                if (data.ipv6addrs.length > 0) {
                    newWifiData.push({
                        item: "IPV6",
                        text: data.ipv6addrs.join("<br/>")
                    })
                }
            }
            // return the data
            self.iconData(newIconData+self._iconPostfix);
            self.wifiData(newWifiData);
            if ($('div.popover .navbar_plugin_wifistatus_contentinner:visible')){
                $('div.popover .navbar_plugin_wifistatus_contentinner').parent().html($('#navbar_plugin_wifistatus_content').html());
                $('div.navbar_plugin_wifistatus_titleIcon').html(self.iconData());
            }
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: WiFiStatusViewModel,
        dependencies: ["settingsViewModel"],
        elements: ["#navbar_plugin_wifistatus"],
    });
});