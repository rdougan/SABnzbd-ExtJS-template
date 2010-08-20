Ext.ns('SABnzbd.views.queue');

/**
 * @class SABnzbd.controllers.QueueController
 * @extends Ext.util.Observable
 * Controls anything to do with the main download queue
 */
SABnzbd.controllers.QueueController = Ext.extend(Ext.util.Observable, {
    /**
     * True if the queue is currently loading
     */
    loading: false,
    
    /**
     * True if queue is currently active (viewable by the user). defaults to true.
     */
    active: true,
    
	/**
	 * 
	 */
	initListeners: function() {
	    SABnzbd.live.applicationController.on({
	        scope: this,
	        
	        queue  : this.onStart,
	        history: this.onStop,
	        
	        poll: this.load
	    });
	},
    
    /**
     * 
     */
	percentageBar: function(v, record) {
		return String.format('<div style="height:11px;border:1px dotted #000000"><div style="height:11px;font-size:9px;background:#FF6666;width:{0}%"></div></div>', record.percentage);
	},
	
	/**
	 * 
	 */
	status: function(v, record) {
		return String.format('<div class="{0}">{0}</div>', record.status);
	},
	
	/**
	 * 
	 */
	size: function(v, record) {
		return String.format('{0}/{1} ({2}%)', record.sizeleft.substring(0,record.sizeleft.length-3), record.size, record.percentage);
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
			url  : String.format('{0}tapi?mode=queue&start=START&limit=LIMIT&output=json&session={1}', SABnzbd.live.applicationController.host || '', SessionKey),
			scope: this,
			
			success: function(response) {
				var response   = Ext.decode(response.responseText),
				    slots      = response.queue.slots || [],
				    categories = response.queue.categories || [],
				    store;
					
				store = new Ext.data.JsonStore({
					idIndex: 0,
					data   : slots,
				  
					fields: [
						{name:'index',      mapping:'index', type:'int'},
						{name:'nzo_id',     mapping:'nzo_id'},
						{name:'avg_age',    mapping:'avg_age'},
						{name:'cat',        mapping:'cat'},
						{name:'eta',        mapping:'eta'},
						{name:'filename',   mapping:'filename'},
						{name:'mb',         mapping:'mb'},
						{name:'mbleft',     mapping:'mbleft'},
						{name:'msgid',      mapping:'msgid'},
						{name:'percentage', convert: this.percentageBar},
						{name:'priority',   mapping:'priority'},
						{name:'script',     mapping:'script'},
						{name:'size',       convert: this.size},
						{name:'sizeleft',   mapping:'sizeleft'},
						{name:'timeleft',   mapping:'timeleft'},
						{name:'unpackopts', mapping:'unpackopts'},
						{name:'status',     convert: this.status},
						{name:'verbosity',  mapping:'verbosity'}
					]
				});
                
                // catstore = Ext.getCmp('queuecat').getStore();
                // this.CatRecord = Ext.data.Record.create([
                //  'cat'
                // ]);
                // 
                // for (count = catstore.getCount(); count < o.queue.categories.length; count++) {
                //  var Record = new this.CatRecord({
                //      cat: o.queue.categories[count]
                //  });
                //  catstore.add(Record);
                // }
								
				this.fireEvent('load', store);
				
				SABnzbd.live.applicationController.fireEvent('speed',  response.queue.kbpersec);
				SABnzbd.live.applicationController.fireEvent('limit',  response.queue.speedlimit);
				SABnzbd.live.applicationController.fireEvent('status', response.queue.status);
				
				this.loading = false;
			}
		});
	},
	
	/**
	 * 
	 */
	purge: function() {
		Ext.Ajax.request({
			url    : String.format('{0}queue/purge?session={1}', SABnzbd.live.applicationController.host || '', SessionKey),
			success: function(response){
				SABnzbd.live.queueController.reload();
			}
		});
	},
	
    /**
     * Changes the name of a NZB
     */
	setName: function(t, n, o) {
		var nzo_id = SABnzbd.live.applicationController.viewport.queue.grid.getSelectionModel().getSelected().get('nzo_id');
		
		Ext.Ajax.request({
			url    : String.format('{0}tapi?mode=queue&name=rename&value={1}&value2={2}&session={3}', SABnzbd.live.applicationController.host || '', nzo_id, n, SessionKey),
			success: function(response) {
				SABnzbd.live.queueController.reload();
			}
		});
	},
    
    /**
     * Changes the category of a NZB
     */
	setCategory: function(t, n, o) {
		var nzo_id = SABnzbd.live.applicationController.viewport.queue.grid.getSelectionModel().getSelected().get('nzo_id');
		
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=change_cat&value={1}&value2={2}&session={3}', SABnzbd.live.applicationController.host || '', nzo_id, n, SessionKey),
			success: function(response) {
				SABnzbd.live.queueController.reload();
			}
		});
	}
	
	// specialKey: function(t, e) {
    //  if (e.getKey() == e.ENTER) {
    //      t.blur();
    //  }
    // },
});
