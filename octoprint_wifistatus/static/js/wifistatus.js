$(function() {
    function WiFiStatusViewModel(parameters) {
	var self = this;

	self.iconSVG = ko.observable('<path d="M0 0h24v24H0z" fill="none"/>');
	self.title = ko.observable('No connection');

	self.onDataUpdaterPluginMessage = function(plugin, data) {
	    if (plugin != "wifistatus")
		return;

	    svg = '<path d="M0 0h24v24H0z" fill="none"/>';
	    if (!data.interface) {
		svg += '<path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/>';
		title = "No connection';
	    } else {
		quality = Math.round((data.qual / data.qual_max) * 100);
		if (quality > 80)
		    svg += '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>';
		else if (quality > 60)
		    svg += '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"/>';
		else if (quality > 40)
		    svg += '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M4.79 12.52l7.2 8.98H12l.01-.01 7.2-8.98C18.85 12.24 16.1 10 12 10s-6.85 2.24-7.21 2.52z"/>';
		else if (quality > 20)
		    svg += '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/><path d="M6.67 14.86L12 21.49v.01l.01-.01 5.33-6.63C17.06 14.65 15.03 13 12 13s-5.06 1.65-5.33 1.86z"/>';
		else
		    svg += '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" fill-opacity=".3"/>';
		title = 'Interface: ' + data.interface + '\n' +
		    'ESSID: ' + data.essid + '\n' +
		    'Quality: ' + data.qual + '/' + data.qual_max + ' (' +
			quality + '%)\n' +
		    'Signal: ' + data.signal + 'dBm\n';
		if (data.noise != 0)
		    title += 'Noise: ' + data.noise + 'dBm\n';
	    }
	    self.iconSVG(svg);
	    self.title(title);
	}
    }

    OCTOPRINT_VIEWMODELS.push({
	construct: WiFiStatusViewModel,
	elements: ["#navbar_plugin_wifistatus"]
    });
})
