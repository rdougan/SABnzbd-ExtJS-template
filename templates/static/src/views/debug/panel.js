/**
 * @class SABnzbd.views.queue.Index
 * @extends Ext.Panel
 * The main queue panel
 */
SABnzbd.views.debug.Panel = Ext.extend(Ext.Panel, {

	initComponent: function() {
		/**
		* @property grid
		* The download grid
		*/
		Ext.applyIf(this, {
			title: 'Debug',
      
			defaults: {border:false},
      
			layout: 'fit',
			
			autoScroll: true
      
		});
    
		SABnzbd.views.debug.Panel.superclass.initComponent.apply(this, arguments);
	}
});
