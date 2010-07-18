/**
 * @class SABnzbd.views.file.Grid
 * @extends Ext.grid.GridPanel
 * The main file grid panel
 */
SABnzbd.views.file.Grid = Ext.extend(Ext.grid.GridPanel, {

  initComponent: function() {
    Ext.applyIf(this, {
      title: 'Files',
      
      store           : new Ext.data.Store(),
      autoExpandColumn: 1,
			disableSelection: true,
			
			viewConfig: {
				getRowClass: function(record, rowIndex, rp, ds){
					if (record.get('status') == 'finished') return 'finishedrow';
					if (record.get('status') == 'queued') return 'queuedrow';
				}
			},
      
      columns: [
				{
					header   : 'Status',
					sortable : true,
					resizable: true,
					dataIndex: 'status'
				},
				{
					header   : 'Filename',
					sortable : true,
					resizable: true,
					dataIndex: 'filename'
				},
				{
					header   : '%',
					sortable : true,
					resizable: true,
					dataIndex: 'percentage'
				},
				{
					header   : 'Size',
					sortable : true,
					resizable: true,
					dataIndex: 'size',
					align    : 'right'
				}
			]
    });
    
    SABnzbd.views.file.Grid.superclass.initComponent.apply(this, arguments);
    
    this.initListeners();
  },
  
  /**
   * 
   */
  initListeners: function() {
    
  }
});
