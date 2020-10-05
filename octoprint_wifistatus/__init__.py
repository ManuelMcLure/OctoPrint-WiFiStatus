# coding = utf-8

import octoprint.plugin
from octoprint.util import RepeatedTimer
import sys
import os

class WiFiStatusPlugin(octoprint.plugin.StartupPlugin,
		octoprint.plugin.TemplatePlugin,
		octoprint.plugin.AssetPlugin):

    def on_after_startup(self):
        self._logger.info("WiFiStatus loaded!")

    def get_assets(self):
        return {
            "js": ["js/wifistatus.js"],
        }

__plugin_pythoncompat__ = ">=3.7,<4"

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = WiFiStatusPlugin()

#    global __plugin_hooks__
#    __plugin_hooks__ = {
#        "octoprint.plugin.softwareupdate.check_config":
#            __plugin_implementation__.get_update_information
#    }
