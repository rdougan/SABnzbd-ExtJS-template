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
					disabled: true
				},
				{
					xtype: 'button',
					text: 'Restart',
					icon: 'static/images/restart.png',
					disabled: true
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
    
    	SABnzbd.views.history.Tbar.superclass.initComponent.apply(this, arguments);
	}
});
