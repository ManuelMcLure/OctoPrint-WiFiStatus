$(function () {
  function WiFiStatusViewModel(parameters) {
    var self = this;

    self.settingsViewModel = parameters[0];

    self._svgPrefix = '<path d="M0 0h24v24H0z" fill="none"/>';
    self._iconSVGs = [
      '<path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/>',
      '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>',
      '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"/>',
      '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M4.79 12.52l7.2 8.98H12l.01-.01 7.2-8.98C18.85 12.24 16.1 10 12 10s-6.85 2.24-7.21 2.52z"/>',
      '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M6.67 14.86L12 21.49v.01l.01-.01 5.33-6.63C17.06 14.65 15.03 13 12 13s-5.06 1.65-5.33 1.86z"/>',
      '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/>',
    ];

    self.IconSVG = ko.observable(self._svgPrefix + self._iconSVGs[0]);
    self.interfaces = ko.observableArray([]);
    self.popoverContent = ko.observable(
      '<table style="width: 100%"><thead></thead><tbody><tr><td>No Connection</td></tr></tbody></table>'
    );

    self.enableNetmask = function () {
      if (self.settings) {
        return self.settings.showIPV4Addr() || self.settings.showIPV6Addr();
      } else {
        return false;
      }
    };

    self.onSettingsShown = function () {
      OctoPrint.simpleApiGet("wifistatus").done(function (response) {
        self.interfaces(response.interfaces);
      });
    };

    self.onDataUpdaterPluginMessage = function (plugin, data) {
      if (plugin != "wifistatus") {
        return;
      }

      svg = self._svgPrefix;

      var wifiData = '<table style="width: 100%"><thead></thead><tbody>';

      if (!data.interface) {
        svg += self._iconSVGs[0];
        wifiData += "<tr><td>No Connection</td></tr>";
      } else if (!data.essid) {
        svg += self._iconSVGs[0];
        wifiData += "<tr><td>Interface:</td><td>" + data.interface + "</td></tr>";
        wifiData += "<tr><td>No Connection</td></tr>";
      } else {
        quality = Math.round((data.qual / data.qual_max) * 100);
        if (quality > 80) svg += self._iconSVGs[1];
        else if (quality > 60) svg += self._iconSVGs[2];
        else if (quality > 40) svg += self._iconSVGs[3];
        else if (quality > 20) svg += self._iconSVGs[4];
        else svg += self._iconSVGs[5];

        wifiData += "<tr><td>Interface:</td><td>" + data.interface + "</td></tr>";
        wifiData += "<tr><td>ESSID:</td><td>" + data.essid + "</td></tr>";
        wifiData +=
          "<tr><td>Quality:</td><td>" +
          data.qual +
          "/" +
          data.qual_max +
          " (" +
          quality +
          "%) </td></tr>";
        wifiData += "<tr><td>Bitrate:</td><td>" + data.bitrate + "</td></tr>";
        wifiData += "<tr><td>Signal:</td><td>" + data.signal + " dBm</td></tr>";
        if (data.noise != 0)
          wifiData += "<tr><td>Noise:</td><td>" + data.noise + " dBm</td></tr>";
        if (data.frequency)
          wifiData +=
            "<tr><td>Frequency:</td><td>" + data.frequency + "</td></tr>";
        if (data.bssid)
          wifiData += "<tr><td>BSSID:</td><td>" + data.bssid + "</td></tr>";
        if (data.ipv4addrs) {
          var title = "IPV4:";
          var i;
          for (i = 0; i < data.ipv4addrs.length; i++) {
            wifiData +=
              "<tr><td>" +
              title +
              "</td><td>" +
              data.ipv4addrs[i] +
              "</td></tr>";
            title = "";
          }
        }
        if (data.ipv6addrs) {
          var title = "IPV6:";
          var i;
          for (i = 0; i < data.ipv6addrs.length; i++) {
            wifiData +=
              "<tr><td>" +
              title +
              "</td><td>" +
              data.ipv6addrs[i] +
              "</td></tr>";
            title = "";
          }
        }
        if (data.gateways) {
          var title = "Gateways:";
          var i;
          for (i = 0; i < data.gateways.length; i++) {
            wifiData +=
              "<tr><td>" +
              title +
              "</td><td>" +
              data.gateways[i] +
              "</td></tr>";
            title = "";
          }
        }
      }
      wifiData += "</tbody></table>";
      self.IconSVG(svg);
      self.popoverContent(wifiData);
    };

    self.onBeforeBinding = function () {
      self.settings = self.settingsViewModel.settings.plugins.wifistatus;
    };

  }

  OCTOPRINT_VIEWMODELS.push({
    construct: WiFiStatusViewModel,
    dependencies: ["settingsViewModel"],
    elements: ["#navbar_plugin_wifistatus", "#settings_plugin_wifistatus"],
  });
});
