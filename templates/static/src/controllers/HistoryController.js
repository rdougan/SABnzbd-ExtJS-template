Ext.ns('SABnzbd.views.history');

/**
 * @class SABnzbd.controllers.HistoryController
 * @extends Ext.util.Observable
 * Controls anything to do with the main download queue
 */
SABnzbd.controllers.HistoryController = Ext.extend(Ext.util.Observable, {
    /**
     * True if the queue is currently loading
     */
    loading: false,
    
    /**
     * True if queue is currently active (viewable by the user). defaults to false.
     */
    active: false,
    
	/**
	 * 
	 */
	initListeners: function() {
        SABnzbd.live.applicationController.on({
	        scope: this,
	        
	        history: this.onStart,
	        queue  : this.onStop,
	        
	        poll: this.load
	    });
	},
	
	/**
     * 
     */
	onStart: function() {
	    this.active = true;
	    this.load();
	},
	
	/**
	 * 
	 */
	onStop: function() {
	    this.active = false;
	},
    
    /**
     * 
     */
	load: function() {
	    if (this.loading || !this.active) return;
	    
	    this.loading = true;
	    
		Ext.Ajax.request({
			url  : String.format('{0}tapi?mode=history&output=json&session={1}', SABnzbd.live.applicationController.host || '', SessionKey),
			scope: this,
			
			success: function(response) {
				var response = Ext.decode(response.responseText),
					slots    = response.history.slots || [],
					store;
					
				store = new Ext.data.JsonStore({
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
				
				this.fireEvent('load', store);
				
				this.loading = false;
			}
		});
	}
});