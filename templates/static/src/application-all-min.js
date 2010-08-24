Ext.grid.RowSelectionModel.override({getSelectedIndex:function(){return this.grid.store.indexOf(this.selections.itemAt(0))}});Ext.ns("SABnzbd","SABnzbd.controllers","SABnzbd.views","SABnzbd.live");Ext.onReady(function(){SABnzbd.live.applicationController=new SABnzbd.controllers.ApplicationController();SABnzbd.live.applicationController.launch()});Ext.ns("SABnzbd.views.config");Ext.ns("SABnzbd.views.file");Ext.ns("SABnzbd.views.history");SABnzbd.controllers.HistoryController=Ext.extend(Ext.util.Observable,{loading:false,active:false,initListeners:function(){SABnzbd.live.applicationController.on({scope:this,history:this.onStart,queue:this.onStop,poll:this.load})},onStart:function(){this.active=true;this.load()},onStop:function(){this.active=false},load:function(){if(this.loading||!this.active){return}this.loading=true;Ext.Ajax.request({url:String.format("{0}tapi?mode=history&output=json&session={1}",SABnzbd.live.applicationController.host||"",SessionKey),scope:this,success:function(B){var B=Ext.decode(B.responseText),C=B.history.slots||[],A;A=new Ext.data.JsonStore({idIndex:0,data:C,fields:[{name:"action_line",mapping:"action_line"},{name:"show_details",mapping:"show_details"},{name:"script_log",mapping:"script_log"},{name:"meta",mapping:"meta"},{name:"fail_message",mapping:"fail_message"},{name:"loaded",mapping:"loaded"},{name:"id",mapping:"id"},{name:"size",mapping:"size"},{name:"category",mapping:"category"},{name:"pp",mapping:"pp"},{name:"completeness",mapping:"completeness"},{name:"script",mapping:"script"},{name:"nzb_name",mapping:"nzb_name"},{name:"download_time",mapping:"download_time"},{name:"storage",mapping:"storage"},{name:"status",mapping:"status"},{name:"script_line",mapping:"script_line"},{name:"completed",convert:this.convertTime},{name:"nzo_id",mapping:"nzo_id"},{name:"downloaded",mapping:"downloaded"},{name:"report",mapping:"report"},{name:"path",mapping:"path"},{name:"postproc_time",mapping:"postproc_time"},{name:"name",mapping:"name"},{name:"url",mapping:"url"},{name:"bytes",mapping:"bytes"},{name:"url_info",mapping:"url_info"}]});this.fireEvent("load",A);this.loading=false}})}});Ext.ns("SABnzbd.views.queue");SABnzbd.controllers.QueueController=Ext.extend(Ext.util.Observable,{loading:false,active:true,initListeners:function(){SABnzbd.live.applicationController.on({scope:this,queue:this.onStart,history:this.onStop,poll:this.load})},percentageBar:function(B,A){return String.format('<div style="height:11px;border:1px dotted #000000"><div style="height:11px;font-size:9px;background:#FF6666;width:{0}%"></div></div>',A.percentage)},status:function(B,A){return String.format('<div class="{0}">{0}</div>',A.status)},size:function(B,A){return String.format("{0}/{1} ({2}%)",A.sizeleft.substring(0,A.sizeleft.length-3),A.size,A.percentage)},onStart:function(){this.active=true;this.load()},onStop:function(){this.active=false},load:function(){if(this.loading||!this.active){return}this.loading=true;Ext.Ajax.request({url:String.format("{0}tapi?mode=queue&start=START&limit=LIMIT&output=json&session={1}",SABnzbd.live.applicationController.host||"",SessionKey),scope:this,success:function(C){var C=Ext.decode(C.responseText),D=C.queue.slots||[],B=C.queue.categories||[],A;A=new Ext.data.JsonStore({idIndex:0,data:D,fields:[{name:"index",mapping:"index",type:"int"},{name:"nzo_id",mapping:"nzo_id"},{name:"avg_age",mapping:"avg_age"},{name:"cat",mapping:"cat"},{name:"eta",mapping:"eta"},{name:"filename",mapping:"filename"},{name:"mb",mapping:"mb"},{name:"mbleft",mapping:"mbleft"},{name:"msgid",mapping:"msgid"},{name:"percentage",convert:this.percentageBar},{name:"priority",mapping:"priority"},{name:"script",mapping:"script"},{name:"size",convert:this.size},{name:"sizeleft",mapping:"sizeleft"},{name:"timeleft",mapping:"timeleft"},{name:"unpackopts",mapping:"unpackopts"},{name:"status",convert:this.status},{name:"verbosity",mapping:"verbosity"}]});this.fireEvent("load",A);SABnzbd.live.applicationController.fireEvent("speed",C.queue.kbpersec);SABnzbd.live.applicationController.fireEvent("limit",C.queue.speedlimit);SABnzbd.live.applicationController.fireEvent("status",C.queue.status);this.loading=false}})},purge:function(){Ext.Ajax.request({url:String.format("{0}queue/purge?session={1}",SABnzbd.live.applicationController.host||"",SessionKey),success:function(A){SABnzbd.live.queueController.reload()}})},setName:function(A,D,C){var B=SABnzbd.live.applicationController.viewport.queue.grid.getSelectionModel().getSelected().get("nzo_id");Ext.Ajax.request({url:String.format("{0}tapi?mode=queue&name=rename&value={1}&value2={2}&session={3}",SABnzbd.live.applicationController.host||"",B,D,SessionKey),success:function(E){SABnzbd.live.queueController.reload()}})},setCategory:function(A,D,C){var B=SABnzbd.live.applicationController.viewport.queue.grid.getSelectionModel().getSelected().get("nzo_id");Ext.Ajax.request({url:String.format("{0}tapi?mode=change_cat&value={1}&value2={2}&session={3}",SABnzbd.live.applicationController.host||"",B,D,SessionKey),success:function(E){SABnzbd.live.queueController.reload()}})}});Ext.ns("SABnzbd.views.application");SABnzbd.controllers.ApplicationController=Ext.extend(Ext.util.Observable,{host:"../",pollInterval:1000,launch:function(){this.addEvents("launch","speed","limit","status");this.initControllers();this.initViews();this.initListeners();this.initPolling();this.fireEvent("launch",this)},initControllers:function(){SABnzbd.live.queueController=new SABnzbd.controllers.QueueController();SABnzbd.live.historyController=new SABnzbd.controllers.HistoryController()},initViews:function(){this.viewport=new SABnzbd.views.application.Viewport()},initListeners:function(){this.on({scope:this,launch:function(){for(A in SABnzbd.live){if(A!="applicationController"){var A=SABnzbd.live[A];if(A.init){A.init()}if(A.initViews){A.initViews()}if(A.initListeners){A.initListeners()}}}}})},initPolling:function(){var A=this;this.fireEvent.defer(50,this,["poll"]);setInterval(function(){A.fireEvent("poll")},this.pollInterval)},restart:function(){Ext.Ajax.request({url:String.format("{0}tapi?mode=restart&session={1}",this.host||"",SessionKey)});Ext.Msg.wait("The system is restarting. Refresh the browser in a few seconds")},shutdown:function(){Ext.Ajax.request({url:String.format("{0}tapi?mode=shutdown&session={1}",this.host||"",SessionKey)});Ext.Msg.wait("The system is shuting down. You can now close the browser")},limitSpeed:function(B){var A=B.getValue();Ext.Ajax.request({url:String.format("{0}tapi?mode=config&name=speedlimit&value={1}&session={2}",this.host||"",A,SessionKey)})}});SABnzbd.views.application.Header=Ext.extend(Ext.Panel,{allowLimitUpdate:true,initComponent:function(){Ext.applyIf(this,{height:55,layout:"border",items:[{itemId:"toolbar",region:"north",xtype:"toolbar",height:27,items:[{xtype:"displayfield",fieldLabel:"Label",value:'<img src="static/images/network.png">&nbsp;'},{xtype:"tbtext",text:"Limit Speed:&nbsp;&nbsp;"},{xtype:"numberfield",fieldLabel:"Label",width:50,itemId:"limit",listeners:{scope:this,focus:function(){this.allowLimitUpdate=false},blur:function(){this.allowLimitUpdate=true},change:function(A){SABnzbd.live.applicationController.limitSpeed(A)},specialkey:function(A,B){if(B.getKey()==B.ENTER){A.blur()}}}},{xtype:"tbtext",text:"KB/s"},{xtype:"tbseparator"},{text:"Configuration",icon:"static/images/config.png",handler:function(){SABnzbd.live.configurationController.show()}},{text:"Restart",icon:"static/images/restart.png",handler:function(){SABnzbd.live.applicationController.restart()}},{text:"Shutdown",icon:"static/images/quit.png",handler:function(){SABnzbd.live.applicationController.shutdown()}},"->",{xtype:"displayfield",value:"Status:&nbsp;"},{xtype:"displayfield",value:"",itemId:"status"},{xtype:"tbseparator"},{xtype:"displayfield",fieldLabel:"Label",value:"Speed:&nbsp;"},{xtype:"displayfield",fieldLabel:"Label",value:0,itemId:"speed"}]},{region:"center",bodyStyle:'background-image:url("../static/images/top_bg2.png")',border:false,height:80}]});SABnzbd.views.queue.Index.superclass.initComponent.apply(this,arguments);this.initListeners()},initListeners:function(){SABnzbd.live.applicationController.on({scope:this,limit:function(A){if(this.allowLimitUpdate){this.getComponent("toolbar").getComponent("limit").setValue(A)}},speed:function(A){this.getComponent("toolbar").getComponent("speed").setValue(String.format("{0}KB/s",A))},status:function(A){this.getComponent("toolbar").getComponent("status").setValue(A)}})}});SABnzbd.views.application.Viewport=Ext.extend(Ext.Viewport,{initComponent:function(){this.head=new SABnzbd.views.application.Header({region:"north"});this.queue=new SABnzbd.views.queue.Index();this.history=new SABnzbd.views.history.Index();this.file=new SABnzbd.views.file.Grid();Ext.applyIf(this,{layout:"border",defaults:{border:false},items:[this.head,{region:"center",xtype:"tabpanel",border:false,bodyStyle:"border-width:1px 0",activeTab:0,items:[this.queue,this.history],listeners:{tabchange:function(A,B){SABnzbd.live.applicationController.fireEvent(B.getItemId())}}},{region:"south",xtype:"tabpanel",deferredRender:false,height:200,activeTab:0,items:[this.file]}]});SABnzbd.views.application.Viewport.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.config.Index=Ext.extend(Ext.Window,{initComponent:function(){this.Main=new SABnzbd.views.config.Main({region:"center",src:"config"});this.Menu=new SABnzbd.views.config.Menu({region:"west"});Ext.applyIf(this,{title:"Config",renderTo:Ext.getBody(),width:800,height:600,layout:"border",frame:false,items:[this.Main,this.Menu]});SABnzbd.views.config.Index.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.config.Main=Ext.extend(Ext.Panel,{initComponent:function(){this.bodyCfg={tag:"iframe",src:this.src,cls:this.bodyCls,id:"configframe",style:{border:"0px none"}};SABnzbd.views.config.Main.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.config.Menu=Ext.extend(Ext.grid.GridPanel,{initComponent:function(){Ext.applyIf(this,{store:new Ext.data.ArrayStore({data:[["General","general"],["Folders","directories"],["Switches","switches"],["Servers","server"],["Scheduling","scheduling"],["RSS","rss"],["Email","email"],["Index Sites","newzbin"],["Categories","categories"],["Sorting","sorting"]],fields:[{name:"menu"},{name:"link"}]}),width:200,hideHeaders:true,title:"Menu",listeners:{rowclick:function(A,B){link=this.getSelectionModel().getSelected().get("link");document.getElementById("configframe").src="config/"+link}},sm:new Ext.grid.RowSelectionModel({singleSelect:true,}),columns:[{sortable:false,width:196,resizable:false,dataIndex:"menu"}]});SABnzbd.views.config.Menu.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.file.Grid=Ext.extend(Ext.grid.GridPanel,{initComponent:function(){Ext.applyIf(this,{title:"Files",store:new Ext.data.Store(),autoExpandColumn:1,disableSelection:true,viewConfig:{getRowClass:function(A,D,B,C){if(A.get("status")=="finished"){return"finishedrow"}if(A.get("status")=="queued"){return"queuedrow"}}},columns:[{header:"Status",sortable:true,resizable:true,dataIndex:"status"},{header:"Filename",sortable:true,resizable:true,dataIndex:"filename"},{header:"%",sortable:true,resizable:true,dataIndex:"percentage"},{header:"Size",sortable:true,resizable:true,dataIndex:"size",align:"right"}]});SABnzbd.views.file.Grid.superclass.initComponent.apply(this,arguments);this.initListeners()},initListeners:function(){}});SABnzbd.views.history.Index=Ext.extend(Ext.Panel,{initComponent:function(){this.grid=new SABnzbd.views.history.Grid();Ext.applyIf(this,{title:"History",itemId:"history",defaults:{border:false},layout:"fit",items:[this.grid]});SABnzbd.views.history.Index.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.history.Grid=Ext.extend(Ext.grid.GridPanel,{currentSelection:null,initComponent:function(){this.Tbar=new SABnzbd.views.history.Tbar();Ext.applyIf(this,{store:new Ext.data.Store(),sm:new Ext.grid.RowSelectionModel({singleSelect:true,listeners:{beforerowselect:function(D,B,A,C){}}}),columns:[{header:"File",sortable:false,width:300,dataIndex:"name"},{header:"Category",sortable:false,width:60,dataIndex:"category"},{header:"Status",sortable:false,width:100,dataIndex:"status",align:"center"},{header:"Size",sortable:false,width:150,dataIndex:"size",align:"right"},{header:"Completed",sortable:false,width:150,dataIndex:"completed",align:"right"}],tbar:this.Tbar});SABnzbd.views.history.Grid.superclass.initComponent.apply(this,arguments);this.initListeners()},initListeners:function(){SABnzbd.live.historyController.on({scope:this,load:function(A){this.reconfigure(A,this.getColumnModel());if(this.currentSelection){this.getSelectionModel().selectRow(this.currentSelection)}}});this.on({scope:this,rowclick:function(){this.currentSelection=this.getSelectionModel().getSelectedIndex()}})}});SABnzbd.views.history.Tbar=Ext.extend(Ext.Toolbar,{initComponent:function(){Ext.applyIf(this,{items:[{xtype:"button",text:"Clear",icon:"static/images/clear.png",disabled:true}]});SABnzbd.views.history.Tbar.superclass.initComponent.apply(this,arguments);this.initListeners()},initListeners:function(){}});SABnzbd.views.queue.Index=Ext.extend(Ext.Panel,{initComponent:function(){this.grid=new SABnzbd.views.queue.Grid();Ext.applyIf(this,{title:"Queue",itemId:"queue",defaults:{border:false},layout:"fit",items:[this.grid]});SABnzbd.views.queue.Index.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.queue.Grid=Ext.extend(Ext.grid.EditorGridPanel,{currentSelection:null,initComponent:function(){this.Tbar=new SABnzbd.views.queue.Tbar();Ext.applyIf(this,{store:new Ext.data.Store(),sm:new Ext.grid.RowSelectionModel({singleSelect:true,moveEditorOnEnter:false}),columns:[{header:"Control",sortable:false,width:55,resizable:false,dataIndex:"buttons"},{header:"Category",sortable:false,width:60,dataIndex:"cat",editor:{xtype:"combo",store:new Ext.data.Store(),triggerAction:"all",mode:"local",displayField:"cat",id:"queuecat",listeners:{change:function(A,C,B){SABnzbd.live.queueController.setcat(A,C,B)}}}},{header:"File",sortable:false,width:300,dataIndex:"filename",ColumnID:"filename",editor:{xtype:"textfield",listeners:{change:function(A,C,B){SABnzbd.live.queueController.setname(A,C,B)}}}},{header:"Status",sortable:false,width:100,dataIndex:"status",align:"center"},{header:"Percentage",sortable:false,width:150,dataIndex:"percentage",align:"center"},{header:"Total size",sortable:false,width:150,dataIndex:"size",align:"right"},{header:"ETA",sortable:false,width:100,dataIndex:"timeleft",align:"right"},{header:"Age",sortable:false,width:100,dataIndex:"avg_age",align:"right"}],tbar:this.Tbar});SABnzbd.views.queue.Grid.superclass.initComponent.apply(this,arguments);this.initListeners()},initListeners:function(){SABnzbd.live.queueController.on({scope:this,load:function(A){this.reconfigure(A,this.getColumnModel());if(this.currentSelection){this.getSelectionModel().selectRow(this.currentSelection)}}});this.on({scope:this,rowclick:function(){this.currentSelection=this.getSelectionModel().getSelectedIndex()}})}});SABnzbd.views.queue.Tbar=Ext.extend(Ext.Toolbar,{initComponent:function(){Ext.applyIf(this,{items:[{xtype:"button",text:"Add file",icon:"static/images/open.png",disabled:true},{xtype:"button",text:"Add URL",icon:"static/images/url.png",disabled:true},{xtype:"tbseparator"},{xtype:"button",text:"Pause",icon:"static/images/pause-big.png",disabled:true},{xtype:"button",text:"Clear",icon:"static/images/clear.png",handler:function(){SABnzbd.live.queueController.clear()}}]});SABnzbd.views.queue.Tbar.superclass.initComponent.apply(this,arguments);this.initListeners()},initListeners:function(){SABnzbd.live.queueController.on({scope:this,speed:function(A){this.getComponent("speed").setValue(A)},limit:function(A){this.getComponent("limit").setValue(A)},status:function(A){this.getComponent("status").setValue(A)}})}});