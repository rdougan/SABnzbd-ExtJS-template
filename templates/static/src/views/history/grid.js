/**
 * @class SABnzbd.views.history.Grid
 * @extends Ext.grid.GridPanel
 * The main queue grid panel
 */
SABnzbd.views.history.Grid = Ext.extend(Ext.grid.GridPanel, {
    /**
     * 
     */
    currentSelection: null,

	initComponent: function() {
		this.Tbar = new SABnzbd.views.history.Tbar();

		Ext.applyIf(this, {
			store: new Ext.data.Store(),
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true,
				listeners: {
						beforerowselect: function(sm, i, ke, row){
					}
				}
			}),

			columns: [
				{
					header: 'File',
					sortable: false,
					width: 300,
					dataIndex: 'name'
				},
				{
					header: 'Category',
					sortable: false,
					width: 60,
					dataIndex: 'category'
				},
				{
					header: 'Status',
					sortable: false,
					width: 100,
					dataIndex: 'status',
					align: 'center'
				},
				{
					header: 'Size',
					sortable: false,
					width: 150,
					dataIndex: 'size',
					align: 'right'
				},
				{
					header: 'Completed',
					sortable: false,
					width: 150,
					dataIndex: 'completed',
					align: 'right'
				}
			],
			tbar: this.Tbar
		});
    
		SABnzbd.views.history.Grid.superclass.initComponent.apply(this, arguments);
    
		this.initListeners();
	},
  
	/**
	* 
	*/
	initListeners: function() {
		SABnzbd.live.historyController.on({
			scope: this,
      
			load: function(store) {
				this.reconfigure(store, this.getColumnModel());
				
				//reselect row
				if (this.currentSelection) this.getSelectionModel().selectRow(this.currentSelection);
			}
		});
		
		this.on({
		    scope: this,
		    
		    rowclick: function() {
		        this.currentSelection = this.getSelectionModel().getSelectedIndex();
		    }
		});
	}
});
