SABnzbd.views.config.Menu = Ext.extend(Ext.grid.GridPanel, {

	initComponent: function() {
    
		Ext.applyIf(this, {
			store: new Ext.data.ArrayStore({
				data: [
					['General','general'],
					['Folders','directories'],
					['Switches','switches'],
					['Servers','server'],
					['Scheduling','scheduling'],
					['RSS','rss'],
					['Email','email'],
					['Index Sites','newzbin'],
					['Categories','categories'],
					['Sorting','sorting']
				],
				fields: [
					{name: 'menu'},
					{name: 'link'}
				]
			}),
			
			width: 200,
			hideHeaders: true,
			title: 'Menu',
			
			listeners: {
				rowclick: function(t, r) {
					link = this.getSelectionModel().getSelected().get('link');
					document.getElementById('configframe').src = 'config/'+link;
				}
			},

			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true,
			}),
			
			columns: [{
				sortable: false,
				width: 196,
				resizable: false,
				dataIndex: 'menu'
			}]
      
		});
    
		SABnzbd.views.config.Menu.superclass.initComponent.apply(this, arguments);
	}
});
