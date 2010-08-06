/**
 * @class SABnzbd.views.queue.Index
 * @extends Ext.Toolbar
 * The main queue toolbar
 */
SABnzbd.views.history.Tbar = Ext.extend(Ext.Toolbar, {

	initComponent: function() {
    
		Ext.applyIf(this, {
			items: [
				{
					xtype: 'button',
					text: 'Clear',
					icon: 'static/images/clear.png',
					disabled: true
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
					itemId: 'speed'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Label',
					value: 'KB/s'
				}
			]
		});
    
    	SABnzbd.views.history.Tbar.superclass.initComponent.apply(this, arguments);
    
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
			status: function(s) {
				this.getComponent('status').setValue(s);
			}
		});
	}
});
