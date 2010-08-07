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
	host: '../',
  
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
    
		this.initControllers.defer(100, this);
		this.initViewport.defer(100, this);
    
		//fire the launch event
		this.fireEvent('launch', this);
	},
  
	/**
	 * 
	 */
	initControllers: function() {
		for (controller in SABnzbd.controllers) {
			this.controllers[controller] = new SABnzbd.controllers[controller];
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
 * @class SABnzbd.controllers.BaseController
 * @extends Ext.util.Observable
 * Main application controller. All other controllers should extend this class.
 */
SABnzbd.controllers.BaseController = Ext.extend(Ext.util.Observable, {
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
 * @class SABnzbd.controllers.ApplicationController
 * @extends Ext.util.Observable
 * Controls anything to do with the main application
 */
SABnzbd.controllers.ApplicationController = Ext.extend(SABnzbd.controllers.BaseController, {
	/**
	* 
	*/
		
	initListeners: function() {
		this.on('updater',this.updater);
		this.on('maintabchange',this.maintabchange);
	},
  
	/**
	* 
	*/
	init: function() {

	},
    
	maintab: '',
	
	maintabchange: function(tabname) {
		this.maintab = tabname;
	},
	
	updater: function() {
		setTimeout(function() {
			scope = App.controllers.ApplicationController;
			
			if (scope.maintab == 'history')
				App.controllers.HistoryController.reload(true);
			if (scope.maintab == 'queue')
				App.controllers.QueueController.reload(true);
		}, 1000);
	},

	restart: function() {
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=restart&session={1}', App.host || '', SessionKey),
		});
		Ext.Msg.wait('The system is restarting. Refresh the browser in a few seconds');
	},
	
	shutdown: function() {
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=shutdown&session={1}', App.host || '', SessionKey),
		});
		Ext.Msg.wait('The system is shuting down. You can now close the browser');
	}
});







/**
 * @class SABnzbd.controllers.HistoryController
 * @extends Ext.util.Observable
 * Controls anything to do with the main download queue
 */
SABnzbd.controllers.HistoryController = Ext.extend(SABnzbd.controllers.BaseController, {
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
	
	convertTime: function(v, record) {
		var completed = new Date(record.completed*1000);
		
		var Seconds = completed.getSeconds();
		if (Seconds<10) Seconds = '0'+Seconds;
		var Minutes = completed.getMinutes();
		if (Minutes<10) Minutes = '0'+Minutes;
		var Hours = completed.getHours();
		if (Hours<10) Hours = '0'+Hours;
		var Day = completed.getDate();
		var Month = completed.getMonth();
		var Year = completed.getFullYear();
		return Day+'/'+Month+'-'+Year+' '+Hours+':'+Minutes+':'+Seconds;
	},

	load: function() {
		var currentTime = new Date()
		var starttime = currentTime.getTime();

		Ext.Ajax.request({
			url  : String.format('{0}tapi?mode=history&output=json&session={1}', App.host || '', SessionKey),
			scope: this,
			
			success: function(response) {
				var o = Ext.decode(response.responseText),
					slots = o.history.slots || [];
					
				this.store = new Ext.data.JsonStore({
					idIndex: 0,
					data   : slots,
				  
					fields: [
						{name:'action_line',      mapping:'action_line'},
						{name:'show_details',     mapping:'show_details'},
						{name:'script_log',       mapping:'script_log'},
						{name:'meta',             mapping:'meta'},
						{name:'fail_message',     mapping:'fail_message'},
						{name:'loaded',           mapping:'loaded'},
						{name:'id',               mapping:'id'},
						{name:'size',             mapping:'size'},
						{name:'category',         mapping:'category'},
						{name:'pp',               mapping:'pp'},
						{name:'completeness',     mapping:'completeness'},
						{name:'script',           mapping:'script'},
						{name:'nzb_name',         mapping:'nzb_name'},
						{name:'download_time',    mapping:'download_time'},
						{name:'storage',          mapping:'storage'},
						{name:'status',           mapping:'status'},
						{name:'script_line',      mapping:'script_line'},
						{name:'completed',        convert: this.convertTime},
						{name:'nzo_id',           mapping:'nzo_id'},
						{name:'downloaded',       mapping:'downloaded'},
						{name:'report',           mapping:'report'},
						{name:'path',             mapping:'path'},
						{name:'postproc_time',    mapping:'postproc_time'},
						{name:'name',             mapping:'name'},
						{name:'url',              mapping:'url'},
						{name:'bytes',            mapping:'bytes'},
						{name:'url_info',         mapping:'url_info'}
					]
				});
				
				this.fireEvent('load', this.store);

				var currentTime = new Date()
				console.log('History store loaded (%s ms)',(currentTime.getTime()-starttime));
			}
		});
	},

	reload: function (reload) {
		var currentTime = new Date()
		var starttime = currentTime.getTime();

		Ext.Ajax.request({
			url  : String.format('{0}tapi?mode=history&output=json&session={1}', App.host || '', SessionKey),
			scope: App.viewport.history.grid,
			
			success: function(response){
				var o = Ext.decode(response.responseText);
				slots = o.history.slots || [];
					
				for (count=this.store.getCount();count<slots.length;count++){
					var MyRecord = new Ext.data.Record();
					this.store.add(MyRecord);
				}
				
				for (count=slots.length;count<this.store.getCount();count++){
					this.store.removeAt(count);
				}
				
				for (count=0;count<slots.length;count++){					
					this.store.getAt(count).set('action_line',slots[count].action_line);
					this.store.getAt(count).set('show_details',slots[count].show_details);
					this.store.getAt(count).set('script_log',slots[count].script_log);
					this.store.getAt(count).set('meta',slots[count].meta);
					this.store.getAt(count).set('fail_message',slots[count].fail_message);
					this.store.getAt(count).set('loaded',slots[count].loaded);
					this.store.getAt(count).set('id',slots[count].id);
					this.store.getAt(count).set('size',slots[count].size);
					this.store.getAt(count).set('category',slots[count].category);
					this.store.getAt(count).set('pp',slots[count].pp);
					this.store.getAt(count).set('completeness',slots[count].completeness);
					this.store.getAt(count).set('script',slots[count].script);
					this.store.getAt(count).set('nzb_name',slots[count].nzb_name);
					this.store.getAt(count).set('download_time',slots[count].download_time);
					this.store.getAt(count).set('storage',slots[count].storage);
					this.store.getAt(count).set('status',slots[count].status+' '+slots[count].action_line);
					this.store.getAt(count).set('script_line',slots[count].script_line);
					this.store.getAt(count).set('nzo_id',slots[count].nzo_id);
					this.store.getAt(count).set('downloaded',slots[count].downloaded);
					this.store.getAt(count).set('report',slots[count].report);
					this.store.getAt(count).set('path',slots[count].path);
					this.store.getAt(count).set('postproc_time',slots[count].postproc_time);
					this.store.getAt(count).set('name',slots[count].name);
					this.store.getAt(count).set('url',slots[count].url);
					this.store.getAt(count).set('bytes',slots[count].bytes);
					this.store.getAt(count).set('url_info',slots[count].url_info);
					this.store.getAt(count).set('completed',App.controllers.HistoryController.convertTime(count,slots[count]));
				}

				App.controllers.QueueController.fireEvent('speed', o.history.kbpersec);
				App.controllers.QueueController.fireEvent('status', o.history.status);
				if (reload) App.controllers.ApplicationController.fireEvent('updater');

				var currentTime = new Date()
				console.log('History store updated (%s ms)',(currentTime.getTime()-starttime));
			}
		});
	}
});

/**
 * @class SABnzbd.controllers.QueueController
 * @extends Ext.util.Observable
 * Controls anything to do with the main download queue
 */
SABnzbd.controllers.QueueController = Ext.extend(SABnzbd.controllers.BaseController, {
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
   
	percentageBar: function(v, record) {
		return '<div style="height:11px;border:1px dotted #000000"><div style="height:11px;font-size:9px;background:#FF6666;width:'+record.percentage+'%"></div></div>';
	},
	
	status: function(v, record) {
		return '<div class="'+record.status+'">'+record.status+'</div>';
	},
	
	size: function(v, record) {
		return record.sizeleft.substring(0,record.sizeleft.length-3)+'/'+record.size+' ('+record.percentage+' %)'
	},
   
	load: function() {
		var currentTime = new Date()
		var starttime = currentTime.getTime();

		Ext.Ajax.request({
			url  : String.format('{0}tapi?mode=queue&start=START&limit=LIMIT&output=json&session={1}', App.host || '', SessionKey),
			scope: this,
			
			success: function(response) {
				var o = Ext.decode(response.responseText);
				slots = o.queue.slots || [];
					
				this.store = new Ext.data.JsonStore({
					idIndex: 0,
					data   : slots,
				  
					fields: [
						{name:'index',      mapping:'index', type:'int'},
						{name:'avg_age',    mapping:'avg_age'},
						{name:'cat',        mapping:'cat'},
						{name:'eta',        mapping:'eta'},
						{name:'filename',   mapping:'filename'},
						{name:'mb',         mapping:'mb'},
						{name:'mbleft',     mapping:'mbleft'},
						{name:'msgid',      mapping:'msgid'},
						{name:'percentage', convert: this.percentageBar},
						{name:'priority',   mapping:'priority'},
						{name:'script',     mapping:'script'},
						{name:'size',       convert: this.size},
						{name:'sizeleft',   mapping:'sizeleft'},
						{name:'timeleft',   mapping:'timeleft'},
						{name:'unpackopts', mapping:'unpackopts'},
						{name:'status',     convert: this.status},
						{name:'verbosity',  mapping:'verbosity'}
					]
				});
				
				this.fireEvent('load', this.store);
				this.fireEvent('speed', o.queue.kbpersec);
				this.fireEvent('limit', o.queue.speedlimit);
				this.fireEvent('status', o.queue.status);
				App.controllers.ApplicationController.fireEvent('updater');

				var currentTime = new Date()
				console.log('Queue store loaded (%s ms)',(currentTime.getTime()-starttime));
			}
		});
	},

	/*
	 * The reload function need some work. The reason why I did not just use the load
	 * function is because the load function removes the selectionmodel from the store
	 * and messes up the grid scrolling.
	 */
	reload: function (reload) {
		var currentTime = new Date()
		var starttime = currentTime.getTime();

		Ext.Ajax.request({
			url  : String.format('{0}tapi?mode=queue&start=START&limit=LIMIT&output=json&session={1}', App.host || '', SessionKey),
			scope: App.viewport.queue.grid,
			
			success: function(response){
				var o = Ext.decode(response.responseText);
				slots = o.queue.slots || [];
					
				for (count=this.store.getCount();count<slots.length;count++){
					var MyRecord = new Ext.data.Record();
					this.store.add(MyRecord);
				}
				
				for (count=slots.length;count<this.store.getCount();count++){
					this.store.removeAt(count);
				}
				
				for (count=0;count<slots.length;count++){
					if (slots[count].status == 'Paused'){
						buttons = '<img style="cursor: pointer;" onclick="queueresume(\''+slots[count].nzo_id+'\')" src="../static/images/play.png">';
					} else {
						buttons = '<img style="cursor: pointer;" onclick="queuepause(\''+slots[count].nzo_id+'\')" src="../static/images/pause.png">';
					}
					buttons += ' ';
					buttons += '<img style="cursor: pointer;" onclick="queuedelete(\''+slots[count].nzo_id+'\')" src="../static/images/delete.png">';
					buttons += ' ';
					buttons += '<img style="cursor: pointer;" onclick="queueinfo(\''+slots[count].nzo_id+'\')" src="../static/images/info.png">';
					
					this.store.getAt(count).set('buttons',buttons);
					this.store.getAt(count).set('nzo_id',slots[count].nzo_id);
					this.store.getAt(count).set('filename',slots[count].filename);
					this.store.getAt(count).set('timeleft',slots[count].timeleft);
					this.store.getAt(count).set('size',App.controllers.QueueController.size(count,slots[count]));
					this.store.getAt(count).set('percentage',App.controllers.QueueController.percentageBar(count,slots[count]));
					this.store.getAt(count).set('avg_age',slots[count].avg_age);
					this.store.getAt(count).set('cat',slots[count].cat);
					this.store.getAt(count).set('status',App.controllers.QueueController.status(count,slots[count]));
				}

				App.controllers.QueueController.fireEvent('speed', o.queue.kbpersec);
				App.controllers.QueueController.fireEvent('status', o.queue.status);
				if (reload) App.controllers.ApplicationController.fireEvent('updater');

				var currentTime = new Date()
				console.log('Queue store updated (%s ms)',(currentTime.getTime()-starttime));
			}
		});
	},
	
	clear: function() {
		Ext.Ajax.request({
			url: String.format('{0}queue/purge?session={1}', App.host || '', SessionKey),
			success: function(response){
				App.controllers.QueueController.reload();
			}
		});
	},
	
	limitspeed: function(t) {
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=config&name=speedlimit&value={1}&session={2}', App.host || '', t.getValue(), SessionKey),
		});
	},
	
	specialkey: function(t, e) {
		if (e.getKey() == e.ENTER) {
			t.blur();
		}
	}
});



/**
 * @class SABnzbd.views.application.Menu
 * @extends Ext.Panel
 * The menu for the application
 */
SABnzbd.views.application.Head = Ext.extend(Ext.Panel, {

	initComponent: function() {
		Ext.applyIf(this, {
			height: 80,
      
			layout: 'border',
      
			items: [
			{
				region: 'center',
				html: '<img src="../static/images/top.png">',
				bodyStyle: 'background-image:url("../static/images/top_bg.png")',
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
		this.head = new SABnzbd.views.application.Head({
			region: 'north'
		});
    
		/**
		 * @property queue
		 * The main queue view
		 */
		this.queue = new SABnzbd.views.queue.Index();
		this.history = new SABnzbd.views.history.Index();
    
		/**
		 * @property file
		 * the file list grid
		 */
		this.file = new SABnzbd.views.file.Grid();
    
		Ext.applyIf(this, {
			layout: 'border',
      
			defaults: {border:false},
      
			items: [
				this.head,
				{
					region: 'center',
					xtype : 'tabpanel',
          
					border   : false,
					bodyStyle: 'border-width:1px 0',
					activeTab: 0,
          
					items: [
						this.queue,
						this.history
					],
					
					listeners: {
						tabchange: function(t, p) {
							App.controllers.ApplicationController.fireEvent('maintabchange',p.getItemId());
						}
					}

				},
				{
					region: 'south',
					xtype : 'tabpanel',
					deferredRender: false,
          
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
 * @class SABnzbd.views.history.Index
 * @extends Ext.Panel
 * The main queue panel
 */
SABnzbd.views.history.Index = Ext.extend(Ext.Panel, {

	initComponent: function() {
		/**
		* @property grid
		* The download grid
		*/
		this.grid = new SABnzbd.views.history.Grid();
    
		Ext.applyIf(this, {
			title: 'History',
			
			itemId: 'history',
      
			defaults: {border:false},
      
			layout: 'fit',
      
			items: [
				this.grid
			]
		});
    
		SABnzbd.views.history.Index.superclass.initComponent.apply(this, arguments);
	}
});

/**
 * @class SABnzbd.views.history.Grid
 * @extends Ext.grid.GridPanel
 * The main queue grid panel
 */
SABnzbd.views.history.Grid = Ext.extend(Ext.grid.GridPanel, {

	initComponent: function() {
		this.Tbar = new SABnzbd.views.history.Tbar();

		Ext.applyIf(this, {
			store: new Ext.data.Store(),
			enableDragDrop : true,
			ddGroup: 'queue-dd',
			ddText: 'Place this row.',
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true,
				listeners: {
					beforerowselect: function(sm, i, ke, row){
						// Ext.getCmp('queuegrid').ddText = row.get('filename');
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
		App.controllers.HistoryController.on({
			scope: this,
      
			load: function(store) {
				this.reconfigure(store, this.getColumnModel());
			}
		});
	}
});

/**
 * @class SABnzbd.views.queue.Index
 * @extends Ext.Toolbar
 * The main queue toolbar
 */
SABnzbd.views.history.Tbar = Ext.extend(Ext.Toolbar, {

	initComponent: function() {
    
		Ext.applyIf(this, {
			items: [
				{
					xtype: 'button',
					text: 'Clear',
					icon: 'static/images/clear.png',
					disabled: true
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'button',
					text: 'Shutdown',
					icon: 'static/images/quit.png',
					handler: function() {
						App.controllers.ApplicationController.shutdown();
					}
				},
				{
					xtype: 'button',
					text: 'Restart',
					icon: 'static/images/restart.png',
					handler: function() {
						App.controllers.ApplicationController.restart();
					}
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'button',
					text: 'Config',
					icon: 'static/images/config.png',
					disabled: true
				},
				{
					xtype: 'tbfill'
				},
				{
					xtype: 'displayfield',
					value: 'Status:&nbsp;'
				},
				{
					xtype: 'displayfield',
					value: '',
					id: 'status'
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Label',
					value: 'Speed:&nbsp;'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Label',
					value: 0,
					itemId: 'speed'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Label',
					value: 'KB/s'
				}
			]
		});
    
    	SABnzbd.views.history.Tbar.superclass.initComponent.apply(this, arguments);
    
		this.initListeners();
	},
  
	/**
	* 
	*/
	initListeners: function() {

		App.controllers.QueueController.on({
			scope: this,
			speed: function(s) {
				this.getComponent('speed').setValue(s);
			},
			status: function(s) {
				this.getComponent('status').setValue(s);
			}
		});
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
			
			itemId: 'queue',
      
			defaults: {border:false},
      
			layout: 'fit',
      
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

/**
 * @class SABnzbd.views.queue.Index
 * @extends Ext.Toolbar
 * The main queue toolbar
 */
SABnzbd.views.queue.Tbar = Ext.extend(Ext.Toolbar, {

	initComponent: function() {
		
		Ext.applyIf(this, {
			items: [
				{
					xtype: 'button',
					text: 'Add file',
					icon: 'static/images/open.png',
					disabled: true
				},
				{
					xtype: 'button',
					text: 'Add URL',
					icon: 'static/images/url.png',
					disabled: true
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'button',
					text: 'Pause',
					icon: 'static/images/pause-big.png',
					disabled: true
				},
				{
					xtype: 'button',
					text: 'Clear',
					icon: 'static/images/clear.png',
					handler: function() {
						App.controllers.QueueController.clear();
					}
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Label',
					value: '<img src="static/images/network.png">&nbsp;'
				},
				{
					xtype: 'tbtext',
					text: 'Limit Speed:&nbsp;&nbsp;'
				},
				{
					xtype: 'numberfield',
					fieldLabel: 'Label',
					width: 50,
					itemId: 'limit',
					listeners: {
						change: function(t) {
							App.controllers.QueueController.limitspeed(t);
						},
						specialkey: function(t, e) {
							App.controllers.QueueController.specialkey(t, e);
						}
					}
				},
				{
					xtype: 'tbtext',
					text: 'KB/s'
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'button',
					text: 'Shutdown',
					icon: 'static/images/quit.png',
					handler: function() {
						App.controllers.ApplicationController.shutdown();
					}
				},
				{
					xtype: 'button',
					text: 'Restart',
					icon: 'static/images/restart.png',
					handler: function() {
						App.controllers.ApplicationController.restart();
					}
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'button',
					text: 'Config',
					icon: 'static/images/config.png',
					disabled: true
				},
				{
					xtype: 'tbfill'
				},
				{
					xtype: 'displayfield',
					value: 'Status:&nbsp;'
				},
				{
					xtype: 'displayfield',
					value: '',
					id: 'status'
				},
				{
					xtype: 'tbseparator'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Label',
					value: 'Speed:&nbsp;'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Label',
					value: 0,
					itemId: 'speed'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Label',
					value: 'KB/s'
				}
			]
		});
    
		SABnzbd.views.queue.Tbar.superclass.initComponent.apply(this, arguments);    
    
		this.initListeners();
	},
  
	/**
	* 
	*/
	initListeners: function() {

		App.controllers.QueueController.on({
			scope: this,
			speed: function(s) {
				this.getComponent('speed').setValue(s);
			},
			limit: function(s) {
				this.getComponent('limit').setValue(s);
			},
			status: function(s) {
				this.getComponent('status').setValue(s);
			}
		});
	}
});



