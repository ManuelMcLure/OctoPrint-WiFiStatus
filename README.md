# OctoPrint-WifiStatus

Displays the Wifi status on the OctoPrint navbar.

This plugin will add a WiFi status indicator to the OctoPrint Navbar to give an at-a-glance indication of the quality of the WiFi connection. Clicking (or tapping on mobile) the indicator will pop up more information about the connection. Clicking again will dismiss the extra information.

![WiFiStatus](/assets/WiFiStatus.png)

# Setup

This plugin only works on Linux, and requires that OctoPrint be running under Python 3.7 or higher.

# Configuration

You can configure whether the plugin will display:

- The Access Point BSSID
- The IPV4 address(es) assigned to the WiFi interface
- The IPV6 assress(es) assignes to the WiFi interface

# Acknowledgements

This plugin includes and is heavily dependent on Python3Wifi (https://github.com/ManuelMcLure/python3wifi), a fork of PythonWifi (https://pythonwifi.tuxfamily.org). Thanks to Róman Joost and Sean Robinson for making PythonWifi available.

# License

The plugin is licensed under the GNU Affero General Public License. See `LICENSE.md` for details.

Python3Wifi is licenced under the GNU Lesser General Public License 2+. See `octoprint_wifistatus/pythonwifi/LICENSE.md` for details.
