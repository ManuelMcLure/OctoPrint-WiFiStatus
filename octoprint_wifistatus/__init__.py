# coding = utf-8

import octoprint.plugin
from octoprint.util import RepeatedTimer
import octoprint_wifistatus.pythonwifi.flags
from octoprint_wifistatus.pythonwifi.iwlibs import Wireless, WirelessInfo, Iwrange, getWNICnames
import sys
import os

class WiFiStatusPlugin(octoprint.plugin.StartupPlugin,
		octoprint.plugin.TemplatePlugin,
		octoprint.plugin.AssetPlugin):

    def __init__(self):
        self._updateTimer = None

    def on_after_startup(self):
        self._logger.info("WiFiStatus loaded!")
        self.start_update_timer(5)

    def get_assets(self):
        return {
            "js": ["js/wifistatus.js"],
        }

    def start_update_timer(self, interval):
        self._updateTimer = RepeatedTimer(interval,
                                        self.update_wifi_status,
                                        run_first = True)
        self._updateTimer.start()

    def update_wifi_status(self):
        self._logger.info("WiFiStatus: update_wifi_status called")
        for interface in getWNICNames():
            wifi = Wireless(interface)
            essid = wifi.getEssid()
            if (essid):
                break
        else:
            interface = None

        net_data = {"interface": interface,
                    "essid": essid}

        if not interface is None:
            net_data["bitrate"] = wifi.wireless_info.getBitrate()
            stat, qual, discard, missed_beacon = wifi.getStatistics()
            net_data["qual"] = qual.quality
            net_data["qual_max"] = wifi.getQualityMax().quality
            net_data["signal"] = qual.signallevel
            net_data["noise"] = qual.noiselevel

        self._plugin_manager.send_plugin_message(self._identifier,
                                                net_data)



__plugin_pythoncompat__ = ">=3.7,<4"

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = WiFiStatusPlugin()

#    global __plugin_hooks__
#    __plugin_hooks__ = {
#        "octoprint.plugin.softwareupdate.check_config":
#            __plugin_implementation__.get_update_information
#    }