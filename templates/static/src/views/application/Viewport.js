/**
 * @class SABnzbd.views.application.Viewport
 * @extends Ext.Viewport
 * The main application viewport
 */
SABnzbd.views.application.Viewport = Ext.extend(Ext.Viewport, {

	initComponent: function() {
		/**
		 * @property menu
		 * The menu at the top of the view
		 */
		this.head = new SABnzbd.views.application.Head({
			region: 'north'
		});
    
		/**
		 * @property queue
		 * The main queue view
		 */
		this.queue = new SABnzbd.views.queue.Index();
		this.history = new SABnzbd.views.history.Index();
    
		/**
		 * @property file
		 * the file list grid
		 */
		this.file = new SABnzbd.views.file.Grid();
    
		Ext.applyIf(this, {
			layout: 'border',
      
			defaults: {border:false},
      
			items: [
				this.head,
				{
					region: 'center',
					xtype : 'tabpanel',
          
					border   : false,
					bodyStyle: 'border-width:1px 0',
					activeTab: 0,
          
					items: [
						this.queue,
						this.history
					],
					
					listeners: {
						tabchange: function(t, p) {
							App.controllers.ApplicationController.fireEvent('maintabchange',p.getItemId());
						}
					}

				},
				{
					region: 'south',
					xtype : 'tabpanel',
					deferredRender: false,
          
					height   : 200,
					activeTab: 0,
          
					items: [
						this.file
					]
				}
			]
		});
    
		SABnzbd.views.application.Viewport.superclass.initComponent.apply(this, arguments);
	}
});
