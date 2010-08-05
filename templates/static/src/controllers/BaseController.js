/**
 * @class SABnzbd.controllers.BaseController
 * @extends Ext.util.Observable
 * Main application controller. All other controllers should extend this class.
 */
SABnzbd.controllers.BaseController = Ext.extend(Ext.util.Observable, {
	/**
	 * 
	 */
	constructor: function() {
		SABnzbd.application.superclass.constructor.call(this);
    
		//init any specified listeners
		this.initListeners();
    
		//init the controller
		this.init();
	},
  
	//this should be overwritten if needed
	initListeners: function() {
    
	},
  
	//this should be overwritten
	init: function() {
    
	}
});