/**
 * @class SABnzbd.views.queue.Index
 * @extends Ext.Toolbar
 * The main queue toolbar
 */
SABnzbd.views.queue.Tbar = Ext.extend(Ext.Toolbar, {

	initComponent: function() {
		
		Ext.applyIf(this, {
			items: [
				{
					xtype: 'button',
					text: 'Add file',
					icon: 'static/images/open.png',
					disabled: true
				},
				{
					xtype: 'button',
					text: 'Add URL',
					icon: 'static/images/url.png',
					disabled: true
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'button',
					text: 'Pause',
					icon: 'static/images/pause-big.png',
					disabled: true
				},
				{
					xtype: 'button',
					text: 'Clear',
					icon: 'static/images/clear.png',
					handler: function() {
						App.controllers.QueueController.clear();
					}
				},
				{
					xtype: 'tbseparator'
				},
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
					disabled: true
				},
				{
					xtype: 'tbtext',
					text: 'KB/s'
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'button',
					text: 'Shutdown',
					icon: 'static/images/quit.png',
					handler: function() {
						App.controllers.QueueController.shutdown();
					}
				},
				{
					xtype: 'button',
					text: 'Restart',
					icon: 'static/images/restart.png',
					handler: function() {
						App.controllers.QueueController.restart();
					}
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'button',
					text: 'Config',
					icon: 'static/images/config.png',
					disabled: true
				},
				{
					xtype: 'tbfill'
				},
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
					id: 'speed'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Label',
					value: 'KB/s'
				}
			]
		});
    
		SABnzbd.views.queue.Tbar.superclass.initComponent.apply(this, arguments);    
	},
});