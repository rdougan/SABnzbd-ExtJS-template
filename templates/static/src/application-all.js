SessionKey = 'ba4ddd336ec3ca5dea2f2c7d9e2ba201';

Ext.onReady(function() {
  App = new SABnzbd.application();
});

Ext.ns(
  'SABnzbd',
  
  'SABnzbd.controllers',
  'SABnzbd.views',
  
  'SABnzbd.views.application',
  'SABnzbd.views.queue',
  'SABnzbd.views.history',
  'SABnzbd.views.file',
  'SABnzbd.views.connection',
  'SABnzbd.views.warning',
  'SABnzbd.views.config'
);

/**
 * @class SABnzbd.application
 * @extends Ext.util.Observable
 * Main application
 */
SABnzbd.application = Ext.extend(Ext.util.Observable, {
  /**
   * The SABnzbd host
   */
  host: 'http://192.168.1.69:8080/',
  
  controllers: {},
  
  /**
   * 
   */
  constructor: function() {
    this.addEvents(
      /**
       * @event launch
       * Fires when the application has launched
       */
      'launch'
    );
    
    SABnzbd.application.superclass.constructor.call(this);
    
    this.initControllers.defer(100);
    this.initViewport();
    
    //fire the launch event
    this.fireEvent('launch', this);
  },
  
  /**
   * 
   */
  initControllers: function() {
    for (controller in SABnzbd.controllers) {
      this[controller] = new SABnzbd.controllers[controller];
    };
  },
  
  /**
   * 
   */
  initViewport: function() {
    this.viewport = new SABnzbd.views.application.Viewport();
  }
});

/**
 * @class SABnzbd.controllers.ApplicationController
 * @extends Ext.util.Observable
 * Main application controller. All other controllers should extend this class.
 */
SABnzbd.controllers.ApplicationController = Ext.extend(Ext.util.Observable, {
  /**
   * 
   */
  constructor: function() {
    SABnzbd.application.superclass.constructor.call(this);
    
    //init any specified listeners
    this.initListeners();
    
    //init the controller
    this.init();
  },
  
  //this should be overwritten if needed
  initListeners: function() {
    
  },
  
  //this should be overwritten
  init: function() {
    
  }
});









/**
 * @class SABnzbd.controllers.QueueController
 * @extends Ext.util.Observable
 * Controls anything to do with the main download queue
 */
SABnzbd.controllers.QueueController = Ext.extend(SABnzbd.controllers.ApplicationController, {
  /**
   * 
   */
  initListeners: function() {
    
  },
  
  /**
   * 
   */
  init: function() {
    this.load();
  },
  
  /**
   * 
   */
  load: function() {
    Ext.Ajax.request({
			url    : String.format('{0}tapi?mode=queue&start=START&limit=LIMIT&output=json&session={1}', App.host || '', SessionKey),
			success: function(response) {
				var o = Ext.decode(response.responseText);
				
				console.log(o);
				return;
				
				Ext.getCmp('warningstab').setTitle('Warnings('+o.queue.have_warnings+')');
				for (count=MyStore.getCount();count<o.queue.slots.length;count++){
					var MyRecord = new Ext.data.Record();
					MyStore.add(MyRecord);
				}
				for (count=o.queue.slots.length;count<MyStore.getCount();count++){
					MyStore.removeAt(count);
				}
				for (count=0;count<o.queue.slots.length;count++){
					if (o.queue.slots[count].status == 'Paused'){
						buttons = '<img style="cursor: pointer;" onclick="queueresume(\''+o.queue.slots[count].nzo_id+'\')" src="../static/images/play.png">';
					} else {
						buttons = '<img style="cursor: pointer;" onclick="queuepause(\''+o.queue.slots[count].nzo_id+'\')" src="../static/images/pause.png">';
					}
					buttons += ' ';
					buttons += '<img style="cursor: pointer;" onclick="queuedelete(\''+o.queue.slots[count].nzo_id+'\')" src="../static/images/delete.png">';
					buttons += ' ';
					buttons += '<img style="cursor: pointer;" onclick="queueinfo(\''+o.queue.slots[count].nzo_id+'\')" src="../static/images/info.png">';
					MyStore.getAt(count).set('buttons',buttons);
					MyStore.getAt(count).set('nzo_id',o.queue.slots[count].nzo_id);
					MyStore.getAt(count).set('filename',o.queue.slots[count].filename);
					MyStore.getAt(count).set('timeleft',o.queue.slots[count].timeleft);
					MyStore.getAt(count).set('size',o.queue.slots[count].sizeleft.substring(0,o.queue.slots[count].sizeleft.length-3)+'/'+o.queue.slots[count].size+' ('+o.queue.slots[count].percentage+' %)');
					MyStore.getAt(count).set('percentage','<div style="height:11px;border:1px dotted #000000"><div style="height:11px;font-size:9px;background:#FF6666;width:'+o.queue.slots[count].percentage+'%"></div></div>');
					MyStore.getAt(count).set('avg_age',o.queue.slots[count].avg_age);
					MyStore.getAt(count).set('cat',o.queue.slots[count].cat);
					MyStore.getAt(count).set('status','<div class="'+o.queue.slots[count].status+'">'+o.queue.slots[count].status+'</div>');
				}
				Ext.getCmp('speed').setValue(o.queue.kbpersec);
				Ext.getCmp('status').setValue('<div class="'+o.queue.status+'">'+o.queue.status+'</div>');
				Ext.getCmp('freespace').setValue(o.queue.diskspace1+'/'+o.queue.diskspacetotal1+' MB');

				Ext.getCmp('queuetab').setIconClass('');
				if (reload) {
					if (maintab == 'historytab') {
						setTimeout('loadhistory(true)',1000);
					};
					if (maintab == 'queuetab') {
						if (queuetab == 'filestab') {
							if (SABid != '') {
								loadfiles(true);
							} else {
								Ext.getCmp(queuetab).setIconClass('file-icon');
								setTimeout('loadqueue(true)',1000);
							};
						};
						if (queuetab == 'connectionstab') {
							loadconnections(true);
						};
						if (queuetab == 'warningstab') {
							loadwarnings(true);
						};
					};
				};
			}
		});
  }
});



/**
 * @class SABnzbd.views.application.Menu
 * @extends Ext.Panel
 * The menu for the application
 */
SABnzbd.views.application.Menu = Ext.extend(Ext.Panel, {

  initComponent: function() {
    Ext.applyIf(this, {
      height: 127,
      
      layout: 'border',
      
      items: [
        {
          region: 'north',
          xtype : 'toolbar',
          
          height     : 27,
          buttonAlign: 'right',
          
          items: [
            {
              text   : 'Configuration',
              handler: function() {
                
              }
            }
          ]
        },
        {
          region: 'center',
          html  : 'SABnzbd!',
          border: false
        }
      ]
    });
    
    SABnzbd.views.queue.Index.superclass.initComponent.apply(this, arguments);
  }
});

/**
 * @class SABnzbd.views.application.Viewport
 * @extends Ext.Viewport
 * The main application viewport
 */
SABnzbd.views.application.Viewport = Ext.extend(Ext.Viewport, {

  initComponent: function() {
    /**
     * @property menu
     * The menu at the top of the view
     */
    this.menu = new SABnzbd.views.application.Menu({
      region: 'north'
    });
    
    /**
     * @property queue
     * The main queue view
     */
    this.queue = new SABnzbd.views.queue.Index();
    
    /**
     * @property file
     * the file list grid
     */
    this.file = new SABnzbd.views.file.Grid();
    
    Ext.applyIf(this, {
      layout: 'border',
      
      defaults: {border:false},
      
      items: [
        this.menu,
        {
          region: 'center',
          xtype : 'tabpanel',
          
          border   : true,
          bodyStyle: 'border-width:1px 0',
          activeTab: 0,
          
          items: [
            this.queue
          ]
        },
        {
          region: 'south',
          xtype : 'tabpanel',
          
          height   : 200,
          activeTab: 0,
          
          items: [
            this.file
          ]
        }
      ]
    });
    
    SABnzbd.views.application.Viewport.superclass.initComponent.apply(this, arguments);
  }
});





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





/**
 * @class SABnzbd.views.queue.Index
 * @extends Ext.Panel
 * The main queue panel
 */
SABnzbd.views.queue.Index = Ext.extend(Ext.Panel, {

  initComponent: function() {
    /**
     * @property grid
     * The download grid
     */
    this.grid = new SABnzbd.views.queue.Grid();
    
    Ext.applyIf(this, {
      title: 'Queue',
      
      defaults: {border:false},
      
      items: [
        this.grid
      ]
    });
    
    SABnzbd.views.queue.Index.superclass.initComponent.apply(this, arguments);
  }
});

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



