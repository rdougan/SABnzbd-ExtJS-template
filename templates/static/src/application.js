Ext.ns(
	'SABnzbd',

	'SABnzbd.controllers',
	'SABnzbd.views',
	
	'SABnzbd.live'
);

/**
 * @class SABnzbd.application
 * @extends Ext.util.Observable
 * Main application
 */
SABnzbd.application = Ext.extend(Ext.util.Observable, {
	/**
	 * The SABnzbd host
	 */
	host: '../',
  
	controllers: {},
  
	},
  
	/**
	 * 
	 */
	initControllers: function() {
		for (controller in SABnzbd.controllers) {
			this.controllers[controller] = new SABnzbd.controllers[controller];
		};
	},
  
	/**
	 * 
	 */
	initViewport: function() {
		this.viewport = new SABnzbd.views.application.Viewport();
	},

	/**
	 * 
	 */
	initWindows: function() {
		this.ConfigWindow = new SABnzbd.views.config.Index();
	}
});