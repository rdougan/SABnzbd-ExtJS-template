SABnzbd.views.config.Main = Ext.extend(Ext.Panel, {

	initComponent: function() {
    
		Ext.applyIf(this, {
			defaults: {border:false},
      
			layout: 'fit',
			
			frame: true
      
		});
    
		SABnzbd.views.config.Main.superclass.initComponent.apply(this, arguments);
	}
});
