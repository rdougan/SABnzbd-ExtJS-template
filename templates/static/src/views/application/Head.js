/**
 * @class SABnzbd.views.application.Menu
 * @extends Ext.Panel
 * The menu for the application
 */
SABnzbd.views.application.Head = Ext.extend(Ext.Panel, {
    /**
     * 
     */
	initComponent: function() {
		Ext.applyIf(this, {
            height: 104,
			layout: 'border',
      
			items: [
			    {
			        region: 'north',
			        xtype : 'toolbar',
			        height: 27,
			        
			        items: [
			            {
        					xtype: 'displayfield',
        					value: 'Status:&nbsp;'
        				},
        				{
        					xtype: 'displayfield',
        					value: '',
        					id: 'status'
        				},
        				{
        					xtype: 'tbseparator'
        				},
        				{
        					xtype: 'displayfield',
        					fieldLabel: 'Label',
        					value: 'Speed:&nbsp;'
        				},
        				{
        					xtype: 'displayfield',
        					fieldLabel: 'Label',
        					value: 0,
        					itemId: 'speed'
        				},
        				{
        					xtype: 'displayfield',
        					fieldLabel: 'Label',
        					value: 'KB/s'
        				},
			            '->',
			            {
        					xtype: 'displayfield',
        					fieldLabel: 'Label',
        					value: '<img src="static/images/network.png">&nbsp;'
        				},
        				{
        					xtype: 'tbtext',
        					text: 'Limit Speed:&nbsp;&nbsp;'
        				},
        				{
        					xtype: 'numberfield',
        					fieldLabel: 'Label',
        					width: 50,
        					itemId: 'limit',
        					listeners: {
        						change: function(t) {
        							SABnzbd.live.queueController.limitspeed(t);
        						},
        						specialkey: function(t, e) {
        							SABnzbd.live.queueController.specialkey(t, e);
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
        				{xtype: 'tbseparator'},
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
        				}
			        ]
			    },
    			{
    				region   : 'center',
    				html     : '<img src="../static/images/top.png">',
    				bodyStyle: 'background-image:url("../static/images/top_bg.png")',
    				border   : false,
        			height   : 80
    			}
			]
		});
    
		SABnzbd.views.queue.Index.superclass.initComponent.apply(this, arguments);
	}
});
