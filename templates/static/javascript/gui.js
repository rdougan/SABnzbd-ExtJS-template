mainUi = Ext.extend(Ext.Viewport, {
	layout: 'border',
	initComponent: function() {
		this.items = [
			{
				xtype: 'tabpanel',
				activeTab: 0,
				id: 'maintabpanel',
				region: 'center',
				width: 100,
				border: false,
				items: [
					{
						xtype: 'panel',
						title: 'Queue',
						layout: 'border',
						id: 'queuetab',
						items: [
							{
								xtype: 'editorgrid',
								store: 'MyStore',
								region: 'center',
								autoExpandColumn: 'filename',
								border: false,
								margins: '0 0 10 0',
								id: 'queuegrid',
								enableDragDrop : true,
								ddGroup : 'mygrid-dd',
								ddText : 'Place this row.',
								sm: new Ext.grid.RowSelectionModel({
									singleSelect:true,
									listeners: {
										beforerowselect: function(sm,i,ke,row){
											Ext.getCmp('queuegrid').ddText = row.get('filename');
										}
									}
								}),
								columns: [
									{
										xtype: 'gridcolumn',
										sortable: true,
										resizable: true,
										width: 55,
										dataIndex: 'buttons',
										menuDisabled: true
									},
									{
										xtype: 'gridcolumn',
										header: 'Category',
										sortable: true,
										resizable: true,
										width: 60,
										dataIndex: 'cat',
										menuDisabled: true,
										editor: {
											xtype: 'combo',
											fieldLabel: 'Label',
											store: 'MyStore4',
											triggerAction: 'all',
											mode: 'local',
											displayField: 'cat',
											id: 'queuecat'
										}
									},
									{
										xtype: 'gridcolumn',
										header: 'File',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'filename',
										menuDisabled: true,
										id: 'filename',
										editor: {
											xtype: 'textfield',
											fieldLabel: 'Label',
											id: 'queuename'
										}
									},
									{
										xtype: 'gridcolumn',
										header: 'Status',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'status',
										align: 'center',
										menuDisabled: true
									},
									{
										xtype: 'gridcolumn',
										sortable: true,
										resizable: true,
										width: 150,
										dataIndex: 'percentage',
										format: '00 %',
										menuDisabled: true
									},
									{
										xtype: 'gridcolumn',
										header: 'Total size',
										sortable: true,
										resizable: true,
										width: 150,
										dataIndex: 'size',
										align: 'right',
										menuDisabled: true
									},
									{
										xtype: 'gridcolumn',
										header: 'ETA',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'timeleft',
										align: 'right',
										menuDisabled: true
									},
									{
										xtype: 'gridcolumn',
										header: 'Age',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'avg_age',
										align: 'right',
										menuDisabled: true
									}
								],
								tbar: {
									xtype: 'toolbar',
									items: [
										{
											xtype: 'button',
											text: 'Add file',
											icon: '../static/images/open.png',
											id: 'addfilebutton'
										},
										{
											xtype: 'button',
											text: 'Add URL',
											icon: '../static/images/url.png',
											id: 'addurlbutton'
										},
										{
											xtype: 'tbseparator'
										},
										{
											xtype: 'button',
											text: 'Pause',
											icon: '../static/images/pause-big.png',
											id: 'pausebutton'
										},
										{
											xtype: 'button',
											text: 'Clear',
											icon: '../static/images/clear.png',
											id: 'clearbutton'
										},
										{
											xtype: 'tbseparator'
										},
										{
											xtype: 'displayfield',
											fieldLabel: 'Label',
											value: '<img src="../static/images/network.png">&nbsp;'
										},
										{
											xtype: 'tbtext',
											text: 'Limit Speed:&nbsp;&nbsp;'
										},
										{
											xtype: 'numberfield',
											fieldLabel: 'Label',
											width: 50,
											id: 'speedlimit'
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
											icon: '../static/images/quit.png',
											id: 'shutdownbutton'
										},
										{
											xtype: 'button',
											text: 'Restart',
											icon: '../static/images/restart.png',
											id: 'restartbutton'
										},
										{
											xtype: 'tbseparator'
										},
										{
											xtype: 'button',
											text: 'Config',
											icon: '../static/images/config.png',
											id: 'configbutton'
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
											id: 'speed'
										},
										{
											xtype: 'displayfield',
											fieldLabel: 'Label',
											value: 'KB/s'
										}
									]
								}
							},
							{
								xtype: 'tabpanel',
								activeTab: 0,
								region: 'south',
								width: 100,
								id: 'queuetabpanel',
								autoHeight: true,
								border: false,
								items: [
									{
										xtype: 'panel',
										title: 'Files',
										layout: 'anchor',
										iconCls: 'file-icon',
										id: 'filestab',
										items: [
											{
												xtype: 'grid',
												store: 'MyStore3',
												height: 200,
												autoExpandColumn: 1,
												border: false,
												disableSelection: true,
												viewConfig: {
													getRowClass: function(record, rowIndex, rp, ds){
														if (record.get('status')=='finished') {
															return 'finishedrow';
														}
														if (record.get('status')=='queued') {
															return 'queuedrow';
														}
													}
												},
												columns: [
													{
														xtype: 'gridcolumn',
														header: 'Status',
														sortable: true,
														resizable: true,
														width: 100,
														dataIndex: 'status'
													},
													{
														xtype: 'gridcolumn',
														header: 'Filename',
														sortable: true,
														resizable: true,
														width: 100,
														dataIndex: 'filename'
													},
													{
														xtype: 'gridcolumn',
														header: '',
														sortable: true,
														resizable: true,
														width: 150,
														dataIndex: 'percentage'
													},
													{
														xtype: 'gridcolumn',
														header: 'Size',
														sortable: true,
														resizable: true,
														width: 150,
														dataIndex: 'size',
														align: 'right'
													}
												]
											}
										]
									},
									{
										xtype: 'panel',
										title: 'Connections',
										layout: 'anchor',
										autoHeight: true,
										iconCls: 'conection-icon',
										id: 'connectionstab',
										items: [
											{
												xtype: 'grid',
												store: 'MyStore2',
												height: 200,
												border: false,
												autoExpandColumn: 2,
												columns: [
													{
														xtype: 'numbercolumn',
														header: 'Thread',
														sortable: true,
														resizable: true,
														width: 60,
														format: '# 0',
														align: 'right',
														dataIndex: 'thread'
													},
													{
														xtype: 'gridcolumn',
														header: 'Poster',
														sortable: true,
														resizable: true,
														width: 300,
														dataIndex: 'poster'
													},
													{
														xtype: 'gridcolumn',
														header: 'Part',
														sortable: true,
														resizable: true,
														width: 300,
														dataIndex: 'part'
													}
												]
											}
										]
									},
									{
										xtype: 'panel',
										title: 'Warnings',
										layout: 'anchor',
										iconCls: 'warning-icon',
										id: 'warningstab',
										items: [
											{
												xtype: 'grid',
												store: 'MyStore5',
												height: 200,
												border: false,
												autoExpandColumn: 'warning',
												columns: [
													{
														xtype: 'gridcolumn',
														header: 'Warning',
														sortable: true,
														resizable: true,
														id: 'warning',
														dataIndex: 'warning'
													}
												]
											}
										]
									}
								]
							}
						]
					},
					{
						xtype: 'panel',
						title: 'History',
						layout: 'border',
						id: 'historytab',
						items: [
							{
								xtype: 'grid',
								store: 'MyStore1',
								region: 'center',
								autoExpandColumn: 'file',
								border: false,
								margins: '0 0 10 0',
								columns: [
									{
										xtype: 'gridcolumn',
										header: 'File',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'nzb_name',
										id: 'file'
									},
									{
										xtype: 'gridcolumn',
										header: 'Status',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'status',
										align: 'center'
									},
									{
										xtype: 'gridcolumn',
										header: 'Download time',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'downloadtime',
										align: 'right'
									},
									{
										xtype: 'gridcolumn',
										header: 'Size',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'size',
										align: 'right'
									}
								],
								tbar: {
									xtype: 'toolbar',
									items: [
										{
											xtype: 'button',
											text: 'Clear all',
											icon: '../static/images/clear.png'
										},
										{
											xtype: 'button',
											text: 'Clear failed',
											icon: '../static/images/clear.png'
										},
										{
											xtype: 'tbseparator'
										},
										{
											xtype: 'button',
											text: 'Config',
											icon: '../static/images/config.png',
											id: 'configbuttonhis'
										}
									]
								}
							},
							{
								xtype: 'tabpanel',
								activeTab: 0,
								region: 'south',
								border: false,
								items: [
									{
										xtype: 'panel',
										title: 'Information',
										layout: 'anchor',
										border: false,
										items: [
											{
												xtype: 'panel',
												border: false,
												height: 200,
												html: 'sdfsdfs'
											}
										]
									}
								]
							}
						]
					}
				],
				bbar: {
					xtype: 'toolbar',
					items: [
						{
							xtype: 'displayfield',
							value: '',
							id: 'testdata'
						},
						{
							xtype: 'tbfill'
						},
						{
							xtype: 'displayfield',
							fieldLabel: 'Label',
							value: 'Free:&nbsp;'
						},
						{
							xtype: 'displayfield',
							fieldLabel: 'Label',
							value: '',
							id: 'freespace'
						}
					]
				}
			},
			{
				xtype: 'panel',
				region: 'north',
				height: 80,
				border: false,
				html: '<img src="../static/images/top.png">',
				bodyStyle: 'background-image:url("../static/images/top_bg.png")'
			}
		];
		mainUi.superclass.initComponent.call(this);
	}
});

MyWindowUi = Ext.extend(Ext.Window, {
	title: 'Add file',
	width: 400,
	autoHeight: true,
	closable: false,
	modal: true,
	id: 'myWindow',
	initComponent: function() {
		this.items = [
			{
				xtype: 'form',
				labelWidth: 100,
				labelAlign: 'left',
				layout: 'form',
				fileUpload: true,
				border: false,
				frame: true,
				id: 'myForm',
				items: [
					{
						xtype: 'combo',
						fieldLabel: 'Category',
						anchor: '100%',
						store: 'MyStore4',
						displayField: 'cat',
						mode: 'local',
						triggerAction: 'all',
						id: 'fileaddcat',
						name: 'cat'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Session',
						anchor: '100%',
						name: 'session',
						inputType: 'hidden',
						id: 'session'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'pp',
						anchor: '100%',
						name: 'pp',
						inputType: 'hidden',
						id: 'pp',
						value: '-1'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'mode',
						anchor: '100%',
						name: 'mode',
						inputType: 'hidden',
						id: 'mode',
						value: 'addfile'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'priority',
						anchor: '100%',
						name: 'priority',
						inputType: 'hidden',
						id: 'priority',
						value: '-100'
					},
					{
						xtype: 'fileuploadfield',
						fieldLabel: 'File',
						emptyText: 'Select a file',
						anchor: '95%',
						name: 'nzbfile',
						id: 'nzbfile'
					}
				],
				buttons: [{
					text: 'Add',
					handler: function(){
						if(Ext.getCmp('myForm').getForm().isValid()){
							Ext.getCmp('myForm').getForm().submit({
								url: 'tapi'
							});
							Ext.getCmp('myWindow').hide();
						}
					}
				},{
					text: 'Cancel',
					handler: function(){
						Ext.getCmp('myWindow').hide();
					}
				}]
			}
		];
		MyWindowUi.superclass.initComponent.call(this);
	}
});

MyWindow1Ui = Ext.extend(Ext.Window, {
	title: 'My Window',
	width: 400,
	autoHeight: true,
	closable: false,
	modal: true,
	id: 'myWindow1',
	initComponent: function() {
		this.items = [
			{
				xtype: 'form',
				labelWidth: 100,
				labelAlign: 'left',
				layout: 'form',
				border: false,
				frame: true,
				id: 'myForm1',
				items: [
					{
						xtype: 'textfield',
						fieldLabel: 'Label',
						anchor: '100%',
						inputType: 'hidden',
						name: 'mode',
						value: 'addurl'
					},
				   {
						xtype: 'textfield',
						fieldLabel: 'Label',
						anchor: '100%',
						inputType: 'hidden',
						name: 'session',
						id: 'urlsession'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'URL',
						name: 'id',
						anchor: '100%'
					}
				],
				buttons: [{
					text: 'Add',
					handler: function(){
						if(Ext.getCmp('myForm1').getForm().isValid()){
							Ext.getCmp('myForm1').getForm().submit({
								url: 'addID',
								method: 'GET'
							});
							Ext.getCmp('myWindow1').hide();
						}
					}
				},{
					text: 'Cancel',
					handler: function(){
						Ext.getCmp('myWindow1').hide();
					}
				}]
			}
		];
		MyWindow1Ui.superclass.initComponent.call(this);
	}
});
