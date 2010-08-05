/**
 * @class SABnzbd.controllers.HistoryController
 * @extends Ext.util.Observable
 * Controls anything to do with the main download queue
 */
SABnzbd.controllers.ApplicationController = Ext.extend(SABnzbd.controllers.BaseController, {
	/**
	* 
	*/
	initListeners: function() {
    
	},
  
	/**
	* 
	*/
	init: function() {

	},
    
	restart: function() {
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=restart&session={1}', App.host || '', SessionKey),
		});
		Ext.Msg.wait('The system is restarting. Refresh the browser in a few seconds');
	},
	
	shutdown: function() {
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=shutdown&session={1}', App.host || '', SessionKey),
		});
		Ext.Msg.wait('The system is shuting down. You can now close the browser');
	}
});