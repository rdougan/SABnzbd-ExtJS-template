/**
 * @class SABnzbd.controllers.HistoryController
 * @extends Ext.util.Observable
 * Controls anything to do with the main download queue
 */
SABnzbd.controllers.HistoryController = Ext.extend(SABnzbd.controllers.BaseController, {
	/**
	* 
	*/
	initListeners: function() {
    
	},
  
	/**
	* 
	*/
	init: function() {
		this.load();
	},
    
	/**
	* 
	*/
	
	convertTime: function(v, record) {
		var completed = new Date(record.completed*1000);
		
		var Seconds = completed.getSeconds();
		if (Seconds<10) Seconds = '0'+Seconds;
		var Minutes = completed.getMinutes();
		if (Minutes<10) Minutes = '0'+Minutes;
		var Hours = completed.getHours();
		if (Hours<10) Hours = '0'+Hours;
		var Day = completed.getDate();
		var Month = completed.getMonth();
		var Year = completed.getFullYear();
		return Day+'/'+Month+'-'+Year+' '+Hours+':'+Minutes+':'+Seconds;
	},

	load: function() {
		Ext.Ajax.request({
			url  : String.format('{0}tapi?mode=history&output=json&session={1}', App.host || '', SessionKey),
			scope: this,
			
			success: function(response) {
				var o = Ext.decode(response.responseText),
					slots = o.history.slots || [];
					
				this.store = new Ext.data.JsonStore({
					idIndex: 0,
					data   : slots,
				  
					fields: [
						{name:'action_line',      mapping:'action_line'},
						{name:'show_details',     mapping:'show_details'},
						{name:'script_log',       mapping:'script_log'},
						{name:'meta',             mapping:'meta'},
						{name:'fail_message',     mapping:'fail_message'},
						{name:'loaded',           mapping:'loaded'},
						{name:'id',               mapping:'id'},
						{name:'size',             mapping:'size'},
						{name:'category',         mapping:'category'},
						{name:'pp',               mapping:'pp'},
						{name:'completeness',     mapping:'completeness'},
						{name:'script',           mapping:'script'},
						{name:'nzb_name',         mapping:'nzb_name'},
						{name:'download_time',    mapping:'download_time'},
						{name:'storage',          mapping:'storage'},
						{name:'status',           mapping:'status'},
						{name:'script_line',      mapping:'script_line'},
						{name:'completed',        convert: this.convertTime},
						{name:'nzo_id',           mapping:'nzo_id'},
						{name:'downloaded',       mapping:'downloaded'},
						{name:'report',           mapping:'report'},
						{name:'path',             mapping:'path'},
						{name:'postproc_time',    mapping:'postproc_time'},
						{name:'name',             mapping:'name'},
						{name:'url',              mapping:'url'},
						{name:'bytes',            mapping:'bytes'},
						{name:'url_info',         mapping:'url_info'}
					]
				});
				
				this.fireEvent('load', this.store);
				
				return;
			}
		});
  }
});