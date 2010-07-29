/**
 * @class SABnzbd.views.history.Index
 * @extends Ext.Panel
 * The main queue panel
 */
SABnzbd.views.history.Index = Ext.extend(Ext.Panel, {

	initComponent: function() {
		/**
		* @property grid
		* The download grid
		*/
		this.grid = new SABnzbd.views.history.Grid();
    
		Ext.applyIf(this, {
			title: 'History',
      
			defaults: {border:false},
      
			layout: 'fit',
      
			items: [
				this.grid
			]
		});
    
		SABnzbd.views.history.Index.superclass.initComponent.apply(this, arguments);
	}
});
