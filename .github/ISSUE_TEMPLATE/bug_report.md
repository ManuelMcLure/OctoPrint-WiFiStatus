---
name: Bug report
about: Create a report to help us improve
title: "[BUG]"
labels: ''
assignees: ''

---

****ATTENTION****
If the WiFi icon does not appear in the navigation bar and/or the plugin appears as disabled in the Plugin Manager, one of the following is the most likely cause:
- The plugin was installed on an operating system other than Linux.</li>
- The OctoPrint installation is not running under Python 3.7 or higher.</li>

This plugin is _only_ supported on Linux (including the Raspberry Pi) and if OctoPrint is running under Python 3.7 or higher. Note that it is not sufficient that Python 3.7 be installed on the system - OctoPrint must have been configured/upgraded to use Python 3.7 instead of Python 2.7. If you have installed OctoPi and have not taken explicit steps to upgrade to Python 3 then OctoPrint will still be running under Python 2.7 and this plugin _will not_ work. There are _no_ plans to make the plugin work with Python 2.7.

To determine whether OctoPrint is running under Python 3.7 or higher, look at the very bottom of yuor OctoPrint UI in the browser, where there will be a line indicating the version of OctoPrint and the version of Python. If the Python version is not 3.7 or higher this plugin _will not_ work.

If you wish to upgrade your OctoPrint to use Python 3, please check out https://github.com/cp2004/Octoprint-Upgrade-To-Py3 for a script that will help you do the upgrade. Please note that if you use any plugins that have not yet been upgraded to support Python 3 they will be disabled after the upgrade, so weigh your options carefully.

If your problem is one of the issues listed above these are _NOT_ bugs. _DO NOT_ open a bug issue if one of these is your problem. If your problem is something different, please delete this line and all text above, and _COMPLETELY_ fill out the template below.

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Desktop (please complete the following information):**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Smartphone (please complete the following information):**
 - Device: [e.g. iPhone6]
 - OS: [e.g. iOS8.1]
 - Browser [e.g. stock browser, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
