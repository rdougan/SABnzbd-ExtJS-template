/**
 * @class SABnzbd.views.queue.Grid
 * @extends Ext.grid.GridPanel
 * The main queue grid panel
 */
SABnzbd.views.queue.Grid = Ext.extend(Ext.grid.GridPanel, {

  initComponent: function() {
    Ext.applyIf(this, {
      store           : new Ext.data.Store(),
      
      autoExpandColumn: 'filename',
			margins         : '0 0 10 0',
			enableDragDrop  : true,
			
			ddGroup         : 'queue-dd',
			ddText          : 'Place this row.',
			
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true,
				listeners   : {
					beforerowselect: function(sm, i, ke, row){
						Ext.getCmp('queuegrid').ddText = row.get('filename');
					}
				}
			}),
			
			columns: [
				{
					sortable    : true,
					resizable   : true,
					width       : 55,
					dataIndex   : 'buttons',
					menuDisabled: true
				},
				{
					header      : 'Category',
					sortable    : true,
					resizable   : true,
					width       : 60,
					dataIndex   : 'cat',
					menuDisabled: true
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
					header      : 'File',
					sortable    : true,
					resizable   : true,
					width       : 100,
					dataIndex   : 'filename',
					menuDisabled: true
          // editor: {
          //  xtype: 'textfield',
          //  fieldLabel: 'Label',
          //  id: 'queuename'
          // }
				},
				{
					header      : 'Status',
					sortable    : true,
					resizable   : true,
					width       : 100,
					dataIndex   : 'status',
					align       : 'center',
					menuDisabled: true
				},
				{
					sortable    : true,
					resizable   : true,
					width       : 150,
					dataIndex   : 'percentage',
					format      : '00 %',
					menuDisabled: true
				},
				{
					header      : 'Total size',
					sortable    : true,
					resizable   : true,
					width       : 150,
					dataIndex   : 'size',
					align       : 'right',
					menuDisabled: true
				},
				{
					header      : 'ETA',
					sortable    : true,
					resizable   : true,
					width       : 100,
					dataIndex   : 'timeleft',
					align       : 'right',
					menuDisabled: true
				},
				{
					header      : 'Age',
					sortable    : true,
					resizable   : true,
					width       : 100,
					dataIndex   : 'avg_age',
					align       : 'right',
					menuDisabled: true
				}
			]
    });
    
    SABnzbd.views.queue.Grid.superclass.initComponent.apply(this, arguments);
    
    this.initListeners();
  },
  
  /**
   * 
   */
  initListeners: function() {
    
  }
});
