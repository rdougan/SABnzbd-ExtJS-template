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
        
	}
});
