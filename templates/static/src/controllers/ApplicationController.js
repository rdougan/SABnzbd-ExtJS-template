/**
 * @class SABnzbd.controllers.ApplicationController
 * @extends Ext.util.Observable
 * Controls anything to do with the main application
 */
SABnzbd.controllers.ApplicationController = Ext.extend(SABnzbd.controllers.BaseController, {
	/**
	* 
	*/
		
	initListeners: function() {
		this.on('updater',this.updater);
		this.on('maintabchange',this.maintabchange);
	},
  
	/**
	* 
	*/
	init: function() {

	},
    
	maintab: '',
	
	maintabchange: function(tabname) {
		this.maintab = tabname;
	},
	
	updater: function() {
		setTimeout(function() {
			scope = App.controllers.ApplicationController;
			
			if (scope.maintab == 'history')
				App.controllers.HistoryController.reload(true);
			if (scope.maintab == 'queue')
				App.controllers.QueueController.reload(true);
		}, 1000);
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