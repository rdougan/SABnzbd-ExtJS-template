Ext.ns(
	'SABnzbd',

	'SABnzbd.controllers',
	'SABnzbd.views',

	'SABnzbd.views.application',
	'SABnzbd.views.queue',
	'SABnzbd.views.history',
	'SABnzbd.views.file',
	'SABnzbd.views.connection',
	'SABnzbd.views.warning',
	'SABnzbd.views.config',
	'SABnzbd.views.debug'
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
  
	/**
	 * 
	 */
	constructor: function() {
		this.addEvents(
			/**
			 * @event launch
			 * Fires when the application has launched
			 */
			'launch'
		);
    
		SABnzbd.application.superclass.constructor.call(this);
    
		this.initControllers.defer(100, this);
		this.initViewport.defer(100, this);
    
		//fire the launch event
		this.fireEvent('launch', this);
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
	}
});