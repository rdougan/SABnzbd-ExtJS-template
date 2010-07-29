/**
 * @class SABnzbd.views.application.Menu
 * @extends Ext.Panel
 * The menu for the application
 */
SABnzbd.views.application.Head = Ext.extend(Ext.Panel, {

	initComponent: function() {
		Ext.applyIf(this, {
			height: 80,
      
			layout: 'border',
      
			items: [
			{
				region: 'center',
				html: '<img src="../static/images/top.png">',
				bodyStyle: 'background-image:url("../static/images/top_bg.png")',
				border: false
			}
			]
		});
    
		SABnzbd.views.queue.Index.superclass.initComponent.apply(this, arguments);
	}
});
