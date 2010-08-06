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
		this.on('debugmsg',this.debugmsg);
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

	debugmsg: function(msg) {
		var currentTime = new Date();
		var hours = currentTime.getHours();
		if (hours < 10)
			hours = '0' + hours;
		var minutes = currentTime.getMinutes();
		if (minutes < 10)
			minutes = '0' + minutes;
		var seconds = currentTime.getSeconds();
		if (seconds < 10)
			seconds = '0' + seconds;

		time = hours+':'+minutes+':'+seconds;

		App.viewport.debug.body.insertHtml('afterBegin',time+' - '+msg+'<br>');
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