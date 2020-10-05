# coding = utf-8

__author__ = "Manuel McLure <manuel@mclure.org>"
__license = "GNU Affero General Public License http://www.gnu.org/licenses/agpl.html"
__copyright__ = "Copyright (C) Manuel McLure - Released under terms of the AGPLv3 License"

import octoprint.plugin
from octoprint.util import RepeatedTimer
import sys
import os

class WiFiStatusPlugin(octoprint.plugin.StartupPlugin,
		octoprint.plugin.TemplatePlugin,
		octoprint.plugin.AssetPlugin):

    def on_after_startup(self):
        self._logger.info("WiFiStatus loaded!")

__plugin_name__ = "WiFi Status Plugin"
__plugin_author__ = "Manuel McLure"
__plugin_url__ = "https://github.com/ManuelMcLure/OctoPrint-WiFiStatus"
__plugin_pythoncompat__ = ">=3.7,<4"

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = WiFiStatusPlugin()

#    global __plugin_hooks__
#    __plugin_hooks__ = {
#        "octoprint.plugin.softwareupdate.check_config":
#            __plugin_implementation__.get_update_information
#    }
