SABnzbd.views.config.Main = Ext.extend(Ext.Panel, {

	initComponent: function() {
    
		this.bodyCfg = {
			tag: 'iframe',
			src: this.src,
			cls: this.bodyCls,
			id: 'configframe',
			style: {
				border: '0px none'
			}
		};
    
		SABnzbd.views.config.Main.superclass.initComponent.apply(this, arguments);
	}
});
