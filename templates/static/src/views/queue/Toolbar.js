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
					itemId: 'limit',
					listeners: {
						change: function(t) {
							App.controllers.QueueController.limitspeed(t);
						},
						specialkey: function(t, e) {
							App.controllers.QueueController.specialkey(t, e);
						}
					}
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
						App.controllers.ApplicationController.shutdown();
					}
				},
				{
					xtype: 'button',
					text: 'Restart',
					icon: 'static/images/restart.png',
					handler: function() {
						App.controllers.ApplicationController.restart();
					}
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'button',
					text: 'Config',
					icon: 'static/images/config.png',
					handler: function() {
						App.controllers.QueueController.showconfig();
					}
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
					itemId: 'speed'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Label',
					value: 'KB/s'
				}
			]
		});
    
		SABnzbd.views.queue.Tbar.superclass.initComponent.apply(this, arguments);    
    
		this.initListeners();
	},
  
	/**
	* 
	*/
	initListeners: function() {

		App.controllers.QueueController.on({
			scope: this,
			speed: function(s) {
				this.getComponent('speed').setValue(s);
			},
			limit: function(s) {
				this.getComponent('limit').setValue(s);
			},
			status: function(s) {
				this.getComponent('status').setValue(s);
			}
		});
	}
});
