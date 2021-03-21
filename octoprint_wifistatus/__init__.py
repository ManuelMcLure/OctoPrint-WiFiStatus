# coding = utf-8

_pythonwifi_imported_ = False

import octoprint.plugin
import sys
import logging
import flask
import netifaces as ni
from octoprint.util import RepeatedTimer

try:
    from .python3wifi.iwlibs import Wireless, getWNICnames

    _pythonwifi_imported_ = True
except:
    pass


def __plugin_check__():
    if sys.platform.startswith("linux") and _pythonwifi_imported_:
        return True
    else:
        return False


class WiFiStatusPlugin(
    octoprint.plugin.StartupPlugin,
    octoprint.plugin.TemplatePlugin,
    octoprint.plugin.AssetPlugin,
    octoprint.plugin.SettingsPlugin,
    octoprint.plugin.SimpleApiPlugin,
):
    def update_interface_list(self):
        self._interfaces = [None]
        # Get list of interfaces for settings
        try:
            for interface in getWNICnames():
                self._interfaces.append(interface)
        except:
            pass

    def __init__(self):
        self._updateTimer = None

    def on_after_startup(self):
        self._logger.info("WiFiStatus loaded!")
        self.update_interface_list()
        self.start_update_timer(10.0)

    def get_assets(self):
        return {
            "js": ["js/wifistatus.js"],
            "css": ["css/wifistatus.css"],
        }

    def get_template_configs(self):
        return [
            {
                "type": "navbar",
                "custom_bindings": True,
                "classes": [
                    "dropdown",
                ],
            },
            {
                "type": "settings",
                "custom_bindings": True,
            },
        ]

    def start_update_timer(self, interval):
        self._updateTimer = RepeatedTimer(
            interval, self.update_wifi_status, run_first=True
        )
        self._updateTimer.start()
        self._logger.debug("WiFiStatus: started timer!")

    def update_wifi_status(self):
        self._logger.debug("WiFiStatus: timer fired!")
        try:
            wifi = None
            essid = None
            interface = self.selected_interface
            if interface is not None:
                # Only check specific interface
                try:
                    wifi = Wireless(interface)
                    essid = wifi.getEssid()
                except:
                    essid = None
            else:
                # Loop through available interfaces
                # If only the first element (None) is in the
                # selected interfaces list, try to fetch the
                # list again. This avoids issues with intefaces
                # that don't show up before the plugin is
                # initialized. On a system with no WiFi
                # interfaces at all this will cause a bit of
                # extra CPU usage, but you probably won't be
                # running this plugin on a machine without
                # WiFi anyway.
                if self._interfaces.len() < 2:
                    self.update_interface_list()
                for interface in self._interfaces[1:]:
                    try:
                        wifi = Wireless(interface)
                        essid = wifi.getEssid()
                        if essid:
                            break
                    except:
                        pass
                else:
                    interface = None

            net_data = {"interface": interface, "essid": essid}

            if interface is not None and essid is not None:
                net_data["bitrate"] = wifi.getBitrate()
                stat, qual, discard, missed_beacon = wifi.getStatistics()
                net_data["qual"] = qual.quality
                net_data["qual_max"] = wifi.getQualityMax().quality
                net_data["signal"] = qual.signallevel
                net_data["noise"] = qual.noiselevel
                if self.showFrequency:
                    net_data["frequency"] = wifi.getFrequency()
                if self.showBSSID:
                    net_data["bssid"] = wifi.getAPaddr()
                if self.showIPV4Addr:
                    ipv4addrs = [
                        ad["addr"] for ad in ni.ifaddresses(interface)[ni.AF_INET]
                    ]
                    net_data["ipv4addrs"] = ipv4addrs
                if self.showIPV6Addr:
                    ipv6addrs = [
                        ad["addr"]
                        for ad in ni.ifaddresses(interface)[ni.AF_INET6]
                        if not ad["addr"].endswith("%" + interface)
                    ]
                    net_data["ipv6addrs"] = ipv6addrs

            self._logger.debug(net_data)

            self._plugin_manager.send_plugin_message(self._identifier, net_data)
        except Exception as exc:
            self._logger.debug(f"WiFiStatus: timer exception: {exc.args}")

    def get_update_information(self):
        return {
            "wifistatus": {
                "displayName": "WiFi Status Plugin",
                "displayVersion": self._plugin_version,
                # version check: github repository
                "type": "github_release",
                "user": "ManuelMcLure",
                "repo": "OctoPrint-WiFiStatus",
                "current": self._plugin_version,
                # update method: pip w/ dependency links
                "pip": "https://github.com/ManuelMcLure/OctoPrint-WiFiStatus/archive/{target_version}.zip",
            }
        }

    def get_settings_defaults(self):
        return {
            "interface": None,
            "showBSSID": False,
            "showFrequency": False,
            "showIPV4Addr": False,
            "showIPV6Addr": False,
        }

    def on_settings_load(self):
        return {
            "interface": self._settings.get(["interface"]),
            "showBSSID": self._settings.get_boolean(["showBSSID"]),
            "showFrequency": self._settings.get_boolean(["showFrequency"]),
            "showIPV4Addr": self._settings.get_boolean(["showIPV4Addr"]),
            "showIPV6Addr": self._settings.get_boolean(["showIPV6Addr"]),
        }

    def on_settings_initialized(self):
        self.selected_interface = self._settings.get(["interface"])
        self.showBSSID = self._settings.get_boolean(["showBSSID"])
        self.showFrequency = self._settings.get_boolean(["showFrequency"])
        self.showIPV4Addr = self._settings.get_boolean(["showIPV4Addr"])
        self.showIPV6Addr = self._settings.get_boolean(["showIPV6Addr"])

    def on_settings_save(self, data):
        octoprint.plugin.SettingsPlugin.on_settings_save(self, data)
        self.on_settings_initialized()

    def on_api_get(self, request):
        self.update_interface_list()
        return flask.jsonify(interfaces=self._interfaces)

__plugin_pythoncompat__ = ">=3.7,<4"


def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = WiFiStatusPlugin()

    # ~~ Softwareupdate hook

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }
