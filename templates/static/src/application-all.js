Ext.grid.RowSelectionModel.override({
    getSelectedIndex: function(){
        return this.grid.store.indexOf(this.selections.itemAt(0));
    }
});

Ext.ns(
	'SABnzbd',

	'SABnzbd.controllers',
	'SABnzbd.views',
	
	'SABnzbd.live'
);

Ext.onReady(function() {
    SABnzbd.live.applicationController = new SABnzbd.controllers.ApplicationController();
    SABnzbd.live.applicationController.launch();
});

Ext.ns('SABnzbd.views.config');



Ext.ns('SABnzbd.views.file');

Ext.ns('SABnzbd.views.history');

/**
 * @class SABnzbd.controllers.HistoryController
 * @extends Ext.util.Observable
 * Controls anything to do with the main download queue
 */
SABnzbd.controllers.HistoryController = Ext.extend(Ext.util.Observable, {
    /**
     * True if the queue is currently loading
     */
    loading: false,
    
    /**
     * True if queue is currently active (viewable by the user). defaults to false.
     */
    active: false,
    
	/**
	 * 
	 */
	initListeners: function() {
        SABnzbd.live.applicationController.on({
	        scope: this,
	        
	        history: this.onStart,
	        queue  : this.onStop,
	        
	        poll: this.load
	    });
	},
	
	/**
     * 
     */
	onStart: function() {
	    this.active = true;
	    this.load();
	},
	
	/**
	 * 
	 */
	onStop: function() {
	    this.active = false;
	},
    
    /**
     * 
     */
	load: function() {
	    if (this.loading || !this.active) return;
	    
	    this.loading = true;
	    
		Ext.Ajax.request({
			url  : String.format('{0}tapi?mode=history&output=json&session={1}', SABnzbd.live.applicationController.host || '', SessionKey),
			scope: this,
			
			success: function(response) {
				var response = Ext.decode(response.responseText),
					slots    = response.history.slots || [],
					store;
					
				store = new Ext.data.JsonStore({
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
				
				this.fireEvent('load', store);
				
				this.loading = false;
			}
		});
	}
});

Ext.ns('SABnzbd.views.queue');

/**
 * @class SABnzbd.controllers.QueueController
 * @extends Ext.util.Observable
 * Controls anything to do with the main download queue
 */
SABnzbd.controllers.QueueController = Ext.extend(Ext.util.Observable, {
    /**
     * True if the queue is currently loading
     */
    loading: false,
    
    /**
     * True if queue is currently active (viewable by the user). defaults to true.
     */
    active: true,
    
	/**
	 * 
	 */
	initListeners: function() {
	    SABnzbd.live.applicationController.on({
	        scope: this,
	        
	        queue  : this.onStart,
	        history: this.onStop,
	        
	        poll: this.load
	    });
	},
    
    /**
     * 
     */
	percentageBar: function(v, record) {
		return String.format('<div style="height:11px;border:1px dotted #000000"><div style="height:11px;font-size:9px;background:#FF6666;width:{0}%"></div></div>', record.percentage);
	},
	
	/**
	 * 
	 */
	status: function(v, record) {
		return String.format('<div class="{0}">{0}</div>', record.status);
	},
	
	/**
	 * 
	 */
	size: function(v, record) {
		return String.format('{0}/{1} ({2}%)', record.sizeleft.substring(0,record.sizeleft.length-3), record.size, record.percentage);
	},
	
    /**
     * 
     */
	onStart: function() {
	    this.active = true;
	    this.load();
	},
	
	/**
	 * 
	 */
	onStop: function() {
	    this.active = false;
	},
    
    /**
     * 
     */
	load: function() {
	    if (this.loading || !this.active) return;
	    
	    this.loading = true;
	    
		Ext.Ajax.request({
			url  : String.format('{0}tapi?mode=queue&start=START&limit=LIMIT&output=json&session={1}', SABnzbd.live.applicationController.host || '', SessionKey),
			scope: this,
			
			success: function(response) {
				var response   = Ext.decode(response.responseText),
				    slots      = response.queue.slots || [],
				    categories = response.queue.categories || [],
				    store;
					
				store = new Ext.data.JsonStore({
					idIndex: 0,
					data   : slots,
				  
					fields: [
						{name:'index',      mapping:'index', type:'int'},
						{name:'nzo_id',     mapping:'nzo_id'},
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
                
                // catstore = Ext.getCmp('queuecat').getStore();
                // this.CatRecord = Ext.data.Record.create([
                //  'cat'
                // ]);
                // 
                // for (count = catstore.getCount(); count < o.queue.categories.length; count++) {
                //  var Record = new this.CatRecord({
                //      cat: o.queue.categories[count]
                //  });
                //  catstore.add(Record);
                // }
								
				this.fireEvent('load', store);
				
				SABnzbd.live.applicationController.fireEvent('speed',  response.queue.kbpersec);
				SABnzbd.live.applicationController.fireEvent('limit',  response.queue.speedlimit);
				SABnzbd.live.applicationController.fireEvent('status', response.queue.status);
				
				this.loading = false;
			}
		});
	},
	
	/**
	 * 
	 */
	purge: function() {
		Ext.Ajax.request({
			url    : String.format('{0}queue/purge?session={1}', SABnzbd.live.applicationController.host || '', SessionKey),
			success: function(response){
				SABnzbd.live.queueController.reload();
			}
		});
	},
	
    /**
     * Changes the name of a NZB
     */
	setName: function(t, n, o) {
		var nzo_id = SABnzbd.live.applicationController.viewport.queue.grid.getSelectionModel().getSelected().get('nzo_id');
		
		Ext.Ajax.request({
			url    : String.format('{0}tapi?mode=queue&name=rename&value={1}&value2={2}&session={3}', SABnzbd.live.applicationController.host || '', nzo_id, n, SessionKey),
			success: function(response) {
				SABnzbd.live.queueController.reload();
			}
		});
	},
    
    /**
     * Changes the category of a NZB
     */
	setCategory: function(t, n, o) {
		var nzo_id = SABnzbd.live.applicationController.viewport.queue.grid.getSelectionModel().getSelected().get('nzo_id');
		
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=change_cat&value={1}&value2={2}&session={3}', SABnzbd.live.applicationController.host || '', nzo_id, n, SessionKey),
			success: function(response) {
				SABnzbd.live.queueController.reload();
			}
		});
	}
});



Ext.ns('SABnzbd.views.application');

/**
 * @class SABnzbd.controllers.ApplicationController
 * @extends Ext.util.Observable
 * Controls anything to do with the main application
 */
SABnzbd.controllers.ApplicationController = Ext.extend(Ext.util.Observable, {
	/**
	 * 
	 */
	host: '../',
	
	/**
	 * 
	 */
	pollInterval: 1000,
	
	/**
	 * 
	 */
	launch: function() {
	    this.addEvents(
	        /**
	         * Fired when the app is launched
	         */
	        'launch',
	        
            /**
             * The current speed SABnzbd is downloading at
             */
	        'speed',
	        
            /**
             * The current speed limit
             */
	        'limit',
	        
	        /**
	         * The current download status
	         */
	        'status'
	    );
	    
        this.initControllers();
        this.initViews();
        this.initListeners();
        this.initPolling();
        
        this.fireEvent('launch', this);
	},
	
	/**
     * Sets up any controllers for the application
     */
    initControllers: function() {
        SABnzbd.live.queueController   = new SABnzbd.controllers.QueueController();
        SABnzbd.live.historyController = new SABnzbd.controllers.HistoryController();
    },
    
    /**
     * 
     */
    initViews: function() {
        this.viewport = new SABnzbd.views.application.Viewport();
    },
	
	/**
	 * 
	 */
	initListeners: function() {
        this.on({
            scope: this,
            
            launch: function() {
                for (controller in SABnzbd.live) {
                    if (controller != 'applicationController') {
                        var controller = SABnzbd.live[controller];
                        
                        if (controller.init) controller.init();
                        if (controller.initViews) controller.initViews();
                        if (controller.initListeners) controller.initListeners();
                    };
                };
            }
        });
	},
	
    /**
     * 
     */
	initPolling: function() {
	    var me = this;
	    
	    this.fireEvent.defer(50, this, ['poll']);
	    
	    setInterval(function() {
	        me.fireEvent('poll');
	    }, this.pollInterval);
	},
    
    /**
     * Restarts SABnzbd
     */
	restart: function() {
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=restart&session={1}', this.host || '', SessionKey)
		});
		
		Ext.Msg.wait('The system is restarting. Refresh the browser in a few seconds');
	},
	
    /**
     * Shutsdown the SABnzbd server
     */
	shutdown: function() {
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=shutdown&session={1}', this.host || '', SessionKey)
		});
		
		Ext.Msg.wait('The system is shuting down. You can now close the browser');
	},
	
	/**
	 * Limits the speed of all downloads
	 */
	limitSpeed: function(field) {
	    var value = field.getValue();
	    
		Ext.Ajax.request({
			url    : String.format('{0}tapi?mode=config&name=speedlimit&value={1}&session={2}', this.host || '', value, SessionKey)
            // scope  : this,
            // success: function(response) {
            //     this.fireEvent('limitchange', value, this);
            // }
		});
	}
});

/**
 * @class SABnzbd.views.application.Header
 * @extends Ext.Panel
 * The menu for the application
 */
SABnzbd.views.application.Header = Ext.extend(Ext.Panel, {
    /**
     * True if the limit field is blur'd
     */
    allowLimitUpdate: true,
    
    /**
     * 
     */
	initComponent: function() {
		Ext.applyIf(this, {
            height: 104,
			layout: 'border',
      
			items: [
			    {
			        itemId: 'toolbar',
			        region: 'north',
			        xtype : 'toolbar',
			        height: 27,
			        
			        items: [
			            {
        					xtype: 'displayfield',
        					value: 'Status:&nbsp;'
        				},
        				{
        					xtype : 'displayfield',
        					value : '',
        					itemId: 'status'
        				},
        				{xtype: 'tbseparator'},
        				{
        					xtype     : 'displayfield',
        					fieldLabel: 'Label',
        					value     : 'Speed:&nbsp;'
        				},
        				{
        					xtype     : 'displayfield',
        					fieldLabel: 'Label',
        					value     : 0,
        					itemId    : 'speed'
        				},
			            '->',
			            {
        					xtype     : 'displayfield',
        					fieldLabel: 'Label',
        					value     : '<img src="static/images/network.png">&nbsp;'
        				},
        				{
        					xtype: 'tbtext',
        					text : 'Limit Speed:&nbsp;&nbsp;'
        				},
        				{
        					xtype     : 'numberfield',
        					fieldLabel: 'Label',
        					width     : 50,
        					itemId    : 'limit',
        					listeners : {
        					    scope: this,
        					    
        					    focus: function() {
        					        this.allowLimitUpdate = false;
        					    },
        					    blur: function() {
        					        this.allowLimitUpdate = true;
        					    },
        						change: function(value) {
                                    SABnzbd.live.applicationController.limitSpeed(value);
        						},
        						specialkey: function(t, e) {
                                    if (e.getKey() == e.ENTER) t.blur();
        						}
        					}
        				},
        				{
        					xtype: 'tbtext',
        					text: 'KB/s'
        				},
        				{xtype: 'tbseparator'},
			            {
        					text   : 'Configuration',
        					icon   : 'static/images/config.png',
        					handler: function() {
        						SABnzbd.live.configurationController.show();
        					}
        				},
        				{xtype: 'tbseparator'},
        				{
        					text   : 'Restart',
        					icon   : 'static/images/restart.png',
        					handler: function() {
        						SABnzbd.live.applicationController.restart();
        					}
        				},
        				{
        					text   : 'Shutdown',
        					icon   : 'static/images/quit.png',
        					handler: function() {
        						SABnzbd.live.applicationController.shutdown();
        					}
        				}
			        ]
			    },
    			{
    				region   : 'center',
    				html     : '<img src="../static/images/top.png">',
    				bodyStyle: 'background-image:url("../static/images/top_bg.png")',
    				border   : false,
        			height   : 80
    			}
			]
		});
    
		SABnzbd.views.queue.Index.superclass.initComponent.apply(this, arguments);
		
		this.initListeners();
	},
	
	initListeners: function() {
	    SABnzbd.live.applicationController.on({
	        scope: this,
	        
	        limit: function(limit) {
                if (this.allowLimitUpdate) this.getComponent('toolbar').getComponent('limit').setValue(limit);
			},
	        speed: function(speed) {
                this.getComponent('toolbar').getComponent('speed').setValue(String.format('{0}KB/s', speed));
			},
			status: function(status) {
                this.getComponent('toolbar').getComponent('status').setValue(status);
			}
	    });
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
		this.head = new SABnzbd.views.application.Header({
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
							SABnzbd.live.applicationController.fireEvent(p.getItemId());
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
SABnzbd.views.queue.Grid = Ext.extend(Ext.grid.EditorGridPanel, {
    /**
     * 
     */
    currentSelection: null,
    
	initComponent: function() {
		this.Tbar = new SABnzbd.views.queue.Tbar();
    
		Ext.applyIf(this, {
			store: new Ext.data.Store(),
			sm: new Ext.grid.RowSelectionModel({
				singleSelect:true,
				moveEditorOnEnter:false
			}),

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
					dataIndex: 'cat',
					editor: {
						xtype: 'combo',
						store: new Ext.data.Store(),
						triggerAction: 'all',
						mode: 'local',
						displayField: 'cat',
						id: 'queuecat',
						listeners: {
							change: function (t, n, o) {
								SABnzbd.live.queueController.setcat(t, n, o);
							}
						}
					}
				},
				{
					header: 'File',
					sortable: false,
					width: 300,
					dataIndex: 'filename',
					ColumnID: 'filename',
					editor: {
						xtype: 'textfield',
						listeners: {
							change: function (t, n, o) {
								SABnzbd.live.queueController.setname(t, n, o);
							}
						}
					}
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
		SABnzbd.live.queueController.on({
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
						SABnzbd.live.queueController.clear();
					}
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

		SABnzbd.live.queueController.on({
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



