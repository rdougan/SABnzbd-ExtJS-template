Ext.ns(
	'SABnzbd',

	'SABnzbd.controllers',
	'SABnzbd.views',
	
	'SABnzbd.live'
);

Ext.onReady(function() {
    SABnzbd.live.applicationController = new SABnzbd.controllers.ApplicationController();
    SABnzbd.live.applicationController.launch();
});
