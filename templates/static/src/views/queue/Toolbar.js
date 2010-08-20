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
						SABnzbd.live.queueController.clear();
					}
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

		SABnzbd.live.queueController.on({
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
