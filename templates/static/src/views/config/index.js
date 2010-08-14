SABnzbd.views.config.Index = Ext.extend(Ext.Window, {

	initComponent: function() {
		this.Main = new SABnzbd.views.config.Main({
			region: 'center',
			src: 'config'
		});

		this.Menu = new SABnzbd.views.config.Menu({
			region: 'west'
		});
    
		Ext.applyIf(this, {
			title: 'Config',
			renderTo: Ext.getBody(),
			width: 800,
			height: 600,
			layout: 'border',
			frame:false,
      
			items: [
				this.Main,
				this.Menu
			]
		});
    
		SABnzbd.views.config.Index.superclass.initComponent.apply(this, arguments);
	}
});
