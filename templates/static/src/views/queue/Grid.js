/**
 * @class SABnzbd.views.queue.Grid
 * @extends Ext.grid.GridPanel
 * The main queue grid panel
 */
SABnzbd.views.queue.Grid = Ext.extend(Ext.grid.GridPanel, {

	initComponent: function() {
		this.Tbar = new SABnzbd.views.queue.Tbar();
    
		Ext.applyIf(this, {
			store: new Ext.data.Store(),

			columns: [
				{
					header: 'Control',
					sortable: false,
					width: 55,
					resizable: false,
					dataIndex: 'buttons'
				},
				{
					header: 'Category',
					sortable: false,
					width: 60,
					dataIndex: 'cat'
					// editor: {
						//  xtype: 'combo',
						//  fieldLabel: 'Label',
						//  store: new Ext.data.Store(),
						//  triggerAction: 'all',
						//  mode: 'local',
						//  displayField: 'cat',
						//  id: 'queuecat'
					// }
				},
				{
					header: 'File',
					sortable: false,
					width: 300,
					dataIndex: 'filename',
					ColumnID: 'filename'
					//editor: {
					//	xtype: 'textfield',
					//	fieldLabel: 'Label',
					//	id: 'queuename'
					//}
				},
				{
					header: 'Status',
					sortable: false,
					width: 100,
					dataIndex: 'status',
					align: 'center'
				},
				{
					header: 'Percentage',
					sortable: false,
					width: 150,
					dataIndex: 'percentage',
					align: 'center'
				},
				{
					header: 'Total size',
					sortable: false,
					width: 150,
					dataIndex: 'size',
					align: 'right'
				},
				{
					header: 'ETA',
					sortable: false,
					width: 100,
					dataIndex: 'timeleft',
					align: 'right'
				},
				{
					header: 'Age',
					sortable: false,
					width: 100,
					dataIndex: 'avg_age',
					align: 'right'
				}
			],
			tbar: this.Tbar
		});
    
		SABnzbd.views.queue.Grid.superclass.initComponent.apply(this, arguments);
    
		this.initListeners();
	},
  
	/**
	* 
	*/
	initListeners: function() {

		App.controllers.QueueController.on({
			scope: this,
      
			load: function(store) {
				this.reconfigure(store, this.getColumnModel());
			}
		});
	}
});
