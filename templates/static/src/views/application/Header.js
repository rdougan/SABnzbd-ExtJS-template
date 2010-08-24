/**
 * @class SABnzbd.views.application.Header
 * @extends Ext.Panel
 * The menu for the application
 */
SABnzbd.views.application.Header = Ext.extend(Ext.Panel, {
    /**
     * True if the limit field is blur'd
     */
    allowLimitUpdate: true,
    
    /**
     * 
     */
	initComponent: function() {
		Ext.applyIf(this, {
            height: 55,
			layout: 'border',
      
			items: [
			    {
			        itemId: 'toolbar',
			        region: 'north',
			        xtype : 'toolbar',
			        height: 27,
			        
			        items: [
			            {
        					xtype     : 'displayfield',
        					fieldLabel: 'Label',
        					value     : '<img src="static/images/network.png">&nbsp;'
        				},
        				{
        					xtype: 'tbtext',
        					text : 'Limit Speed:&nbsp;&nbsp;'
        				},
        				{
        					xtype     : 'numberfield',
        					fieldLabel: 'Label',
        					width     : 50,
        					itemId    : 'limit',
        					listeners : {
        					    scope: this,
        					    
        					    focus: function() {
        					        this.allowLimitUpdate = false;
        					    },
        					    blur: function() {
        					        this.allowLimitUpdate = true;
        					    },
        						change: function(value) {
                                    SABnzbd.live.applicationController.limitSpeed(value);
        						},
        						specialkey: function(t, e) {
                                    if (e.getKey() == e.ENTER) t.blur();
        						}
        					}
        				},
        				{
        					xtype: 'tbtext',
        					text: 'KB/s'
        				},
        				{xtype: 'tbseparator'},
			            {
        					text   : 'Configuration',
        					icon   : 'static/images/config.png',
        					handler: function() {
        						SABnzbd.live.configurationController.show();
        					}
        				},
        				{
        					text   : 'Restart',
        					icon   : 'static/images/restart.png',
        					handler: function() {
        						SABnzbd.live.applicationController.restart();
        					}
        				},
        				{
        					text   : 'Shutdown',
        					icon   : 'static/images/quit.png',
        					handler: function() {
        						SABnzbd.live.applicationController.shutdown();
        					}
        				},
			            '->',
			            {
        					xtype: 'displayfield',
        					value: 'Status:&nbsp;'
        				},
        				{
        					xtype : 'displayfield',
        					value : '',
        					itemId: 'status'
        				},
        				{xtype: 'tbseparator'},
        				{
        					xtype     : 'displayfield',
        					fieldLabel: 'Label',
        					value     : 'Speed:&nbsp;'
        				},
        				{
        					xtype     : 'displayfield',
        					fieldLabel: 'Label',
        					value     : 0,
        					itemId    : 'speed'
        				}
			        ]
			    },
    			{
    				region   : 'center',
    				//html     : '<img src="../static/images/top.png">',
    				bodyStyle: 'background-image:url("../static/images/top_bg2.png")',
    				border   : false,
        			height   : 80
    			}
			]
		});
    
		SABnzbd.views.queue.Index.superclass.initComponent.apply(this, arguments);
		
		this.initListeners();
	},
	
	initListeners: function() {
	    SABnzbd.live.applicationController.on({
	        scope: this,
	        
	        limit: function(limit) {
                if (this.allowLimitUpdate) this.getComponent('toolbar').getComponent('limit').setValue(limit);
			},
	        speed: function(speed) {
                this.getComponent('toolbar').getComponent('speed').setValue(String.format('{0}KB/s', speed));
			},
			status: function(status) {
                this.getComponent('toolbar').getComponent('status').setValue(status);
			}
	    });
	}
});
