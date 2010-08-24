Ext.ns('SABnzbd.views.application');

/**
 * @class SABnzbd.controllers.ApplicationController
 * @extends Ext.util.Observable
 * Controls anything to do with the main application
 */
SABnzbd.controllers.ApplicationController = Ext.extend(Ext.util.Observable, {
	/**
	 * 
	 */
	host: '../',
	
	/**
	 * 
	 */
	pollInterval: 1000,
	
	/**
	 * 
	 */
	launch: function() {
	    this.addEvents(
	        /**
	         * Fired when the app is launched
	         */
	        'launch',
	        
            /**
             * The current speed SABnzbd is downloading at
             */
	        'speed',
	        
            /**
             * The current speed limit
             */
	        'limit',
	        
	        /**
	         * The current download status
	         */
	        'status'
	    );
	    
        this.initControllers();
        this.initViews();
        this.initListeners();
        this.initPolling();
        
        this.fireEvent('launch', this);
	},
	
	/**
     * Sets up any controllers for the application
     */
    initControllers: function() {
        SABnzbd.live.queueController   = new SABnzbd.controllers.QueueController();
        SABnzbd.live.historyController = new SABnzbd.controllers.HistoryController();
    },
    
    /**
     * 
     */
    initViews: function() {
        this.viewport = new SABnzbd.views.application.Viewport();
    },
	
	/**
	 * 
	 */
	initListeners: function() {
        this.on({
            scope: this,
            
            launch: function() {
                for (controller in SABnzbd.live) {
                    if (controller != 'applicationController') {
                        var controller = SABnzbd.live[controller];
                        
                        if (controller.init) controller.init();
                        if (controller.initViews) controller.initViews();
                        if (controller.initListeners) controller.initListeners();
                    };
                };
            }
        });
	},
	
    /**
     * 
     */
	initPolling: function() {
	    var me = this;
	    
	    this.fireEvent.defer(50, this, ['poll']);
	    
	    setInterval(function() {
	        me.fireEvent('poll');
	    }, this.pollInterval);
	},
    
    /**
     * Restarts SABnzbd
     */
	restart: function() {
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=restart&session={1}', this.host || '', SessionKey)
		});
		
		Ext.Msg.wait('The system is restarting. Refresh the browser in a few seconds');
	},
	
    /**
     * Shutsdown the SABnzbd server
     */
	shutdown: function() {
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=shutdown&session={1}', this.host || '', SessionKey)
		});
		
		Ext.Msg.wait('The system is shuting down. You can now close the browser');
	},
	
	/**
	 * Limits the speed of all downloads
	 */
	limitSpeed: function(field) {
	    var value = field.getValue();
	    
		Ext.Ajax.request({
			url    : String.format('{0}tapi?mode=config&name=speedlimit&value={1}&session={2}', this.host || '', value, SessionKey)
            // scope  : this,
            // success: function(response) {
            //     this.fireEvent('limitchange', value, this);
            // }
		});
	}
});