/**
 * @class SABnzbd.views.queue.Index
 * @extends Ext.Panel
 * The main queue panel
 */
SABnzbd.views.queue.Index = Ext.extend(Ext.Panel, {

	initComponent: function() {
		/**
		* @property grid
		* The download grid
		*/
		this.grid = new SABnzbd.views.queue.Grid();
    
		Ext.applyIf(this, {
			title: 'Queue',
			
			itemId: 'queue',
      
			defaults: {border:false},
      
			layout: 'fit',
      
			items: [
				this.grid
			]
		});
    
		SABnzbd.views.queue.Index.superclass.initComponent.apply(this, arguments);
	}
});
