SABnzbd.views.config.Menu = Ext.extend(Ext.grid.GridPanel, {

	initComponent: function() {
    
		Ext.applyIf(this, {
			store: new Ext.data.ArrayStore({
				data: [
					['General'],
					['Folders'],
					['Switches'],
					['Servers'],
					['Scheduling'],
					['RSS'],
					['Email'],
					['Index Sites'],
					['Categories'],
					['Sorting']
				],
				fields: [
					{name: 'menu'}
				]
			}),
			
			width: 200,
			hideHeaders: true,
			title: 'Menu',

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
