Ext.onReady(function(){App=new SABnzbd.application()});Ext.ns("SABnzbd","SABnzbd.controllers","SABnzbd.views","SABnzbd.views.application","SABnzbd.views.queue","SABnzbd.views.history","SABnzbd.views.file","SABnzbd.views.connection","SABnzbd.views.warning","SABnzbd.views.config");SABnzbd.application=Ext.extend(Ext.util.Observable,{host:"../",controllers:{},constructor:function(){this.addEvents("launch");SABnzbd.application.superclass.constructor.call(this);this.initControllers.defer(100,this);this.initViewport.defer(100,this);this.initWindows.defer(100,this);this.fireEvent("launch",this)},initControllers:function(){for(controller in SABnzbd.controllers){this.controllers[controller]=new SABnzbd.controllers[controller]}},initViewport:function(){this.viewport=new SABnzbd.views.application.Viewport()},initWindows:function(){this.ConfigWindow=new SABnzbd.views.config.Index()}});SABnzbd.controllers.BaseController=Ext.extend(Ext.util.Observable,{constructor:function(){SABnzbd.application.superclass.constructor.call(this);this.initListeners();this.init()},initListeners:function(){},init:function(){}});SABnzbd.controllers.ApplicationController=Ext.extend(SABnzbd.controllers.BaseController,{initListeners:function(){this.on("updater",this.updater);this.on("maintabchange",this.maintabchange)},init:function(){},maintab:"",maintabchange:function(A){this.maintab=A},updater:function(){setTimeout(function(){scope=App.controllers.ApplicationController;if(scope.maintab=="history"){App.controllers.HistoryController.reload(true)}if(scope.maintab=="queue"){App.controllers.QueueController.reload(true)}},1000)},restart:function(){Ext.Ajax.request({url:String.format("{0}tapi?mode=restart&session={1}",App.host||"",SessionKey),});Ext.Msg.wait("The system is restarting. Refresh the browser in a few seconds")},shutdown:function(){Ext.Ajax.request({url:String.format("{0}tapi?mode=shutdown&session={1}",App.host||"",SessionKey),});Ext.Msg.wait("The system is shuting down. You can now close the browser")}});SABnzbd.controllers.HistoryController=Ext.extend(SABnzbd.controllers.BaseController,{initListeners:function(){},init:function(){this.load()},convertTime:function(I,E){var D=new Date(E.completed*1000);var F=D.getSeconds();if(F<10){F="0"+F}var B=D.getMinutes();if(B<10){B="0"+B}var G=D.getHours();if(G<10){G="0"+G}var H=D.getDate();var C=D.getMonth();var A=D.getFullYear();return H+"/"+C+"-"+A+" "+G+":"+B+":"+F},load:function(){var A=new Date();var B=A.getTime();Ext.Ajax.request({url:String.format("{0}tapi?mode=history&output=json&session={1}",App.host||"",SessionKey),scope:this,success:function(C){var F=Ext.decode(C.responseText),D=F.history.slots||[];this.store=new Ext.data.JsonStore({idIndex:0,data:D,fields:[{name:"action_line",mapping:"action_line"},{name:"show_details",mapping:"show_details"},{name:"script_log",mapping:"script_log"},{name:"meta",mapping:"meta"},{name:"fail_message",mapping:"fail_message"},{name:"loaded",mapping:"loaded"},{name:"id",mapping:"id"},{name:"size",mapping:"size"},{name:"category",mapping:"category"},{name:"pp",mapping:"pp"},{name:"completeness",mapping:"completeness"},{name:"script",mapping:"script"},{name:"nzb_name",mapping:"nzb_name"},{name:"download_time",mapping:"download_time"},{name:"storage",mapping:"storage"},{name:"status",mapping:"status"},{name:"script_line",mapping:"script_line"},{name:"completed",convert:this.convertTime},{name:"nzo_id",mapping:"nzo_id"},{name:"downloaded",mapping:"downloaded"},{name:"report",mapping:"report"},{name:"path",mapping:"path"},{name:"postproc_time",mapping:"postproc_time"},{name:"name",mapping:"name"},{name:"url",mapping:"url"},{name:"bytes",mapping:"bytes"},{name:"url_info",mapping:"url_info"}]});this.fireEvent("load",this.store);var E=new Date();console.log("History store loaded (%s ms)",(E.getTime()-B))}})},reload:function(B){var A=new Date();var C=A.getTime();Ext.Ajax.request({url:String.format("{0}tapi?mode=history&output=json&session={1}",App.host||"",SessionKey),scope:App.viewport.history.grid,success:function(D){var G=Ext.decode(D.responseText);slots=G.history.slots||[];for(count=this.store.getCount();count<slots.length;count++){var E=new Ext.data.Record();this.store.add(E)}for(count=slots.length;count<this.store.getCount();count++){this.store.removeAt(count)}for(count=0;count<slots.length;count++){this.store.getAt(count).set("action_line",slots[count].action_line);this.store.getAt(count).set("show_details",slots[count].show_details);this.store.getAt(count).set("script_log",slots[count].script_log);this.store.getAt(count).set("meta",slots[count].meta);this.store.getAt(count).set("fail_message",slots[count].fail_message);this.store.getAt(count).set("loaded",slots[count].loaded);this.store.getAt(count).set("id",slots[count].id);this.store.getAt(count).set("size",slots[count].size);this.store.getAt(count).set("category",slots[count].category);this.store.getAt(count).set("pp",slots[count].pp);this.store.getAt(count).set("completeness",slots[count].completeness);this.store.getAt(count).set("script",slots[count].script);this.store.getAt(count).set("nzb_name",slots[count].nzb_name);this.store.getAt(count).set("download_time",slots[count].download_time);this.store.getAt(count).set("storage",slots[count].storage);this.store.getAt(count).set("status",slots[count].status+" "+slots[count].action_line);this.store.getAt(count).set("script_line",slots[count].script_line);this.store.getAt(count).set("nzo_id",slots[count].nzo_id);this.store.getAt(count).set("downloaded",slots[count].downloaded);this.store.getAt(count).set("report",slots[count].report);this.store.getAt(count).set("path",slots[count].path);this.store.getAt(count).set("postproc_time",slots[count].postproc_time);this.store.getAt(count).set("name",slots[count].name);this.store.getAt(count).set("url",slots[count].url);this.store.getAt(count).set("bytes",slots[count].bytes);this.store.getAt(count).set("url_info",slots[count].url_info);this.store.getAt(count).set("completed",App.controllers.HistoryController.convertTime(count,slots[count]))}App.controllers.QueueController.fireEvent("speed",G.history.kbpersec);App.controllers.QueueController.fireEvent("status",G.history.status);if(B){App.controllers.ApplicationController.fireEvent("updater")}var F=new Date();console.log("History store updated (%s ms)",(F.getTime()-C))}})}});SABnzbd.controllers.QueueController=Ext.extend(SABnzbd.controllers.BaseController,{initListeners:function(){},init:function(){this.load()},percentageBar:function(B,A){return'<div style="height:11px;border:1px dotted #000000"><div style="height:11px;font-size:9px;background:#FF6666;width:'+A.percentage+'%"></div></div>'},status:function(B,A){return'<div class="'+A.status+'">'+A.status+"</div>"},size:function(B,A){return A.sizeleft.substring(0,A.sizeleft.length-3)+"/"+A.size+" ("+A.percentage+" %)"},load:function(){var A=new Date();var B=A.getTime();Ext.Ajax.request({url:String.format("{0}tapi?mode=queue&start=START&limit=LIMIT&output=json&session={1}",App.host||"",SessionKey),scope:this,success:function(D){var F=Ext.decode(D.responseText);slots=F.queue.slots||[];cats=F.queue.categories||[];this.storeQueue=new Ext.data.JsonStore({idIndex:0,data:slots,fields:[{name:"index",mapping:"index",type:"int"},{name:"nzo_id",mapping:"nzo_id"},{name:"avg_age",mapping:"avg_age"},{name:"cat",mapping:"cat"},{name:"eta",mapping:"eta"},{name:"filename",mapping:"filename"},{name:"mb",mapping:"mb"},{name:"mbleft",mapping:"mbleft"},{name:"msgid",mapping:"msgid"},{name:"percentage",convert:this.percentageBar},{name:"priority",mapping:"priority"},{name:"script",mapping:"script"},{name:"size",convert:this.size},{name:"sizeleft",mapping:"sizeleft"},{name:"timeleft",mapping:"timeleft"},{name:"unpackopts",mapping:"unpackopts"},{name:"status",convert:this.status},{name:"verbosity",mapping:"verbosity"}]});catstore=Ext.getCmp("queuecat").getStore();this.CatRecord=Ext.data.Record.create(["cat"]);for(count=catstore.getCount();count<F.queue.categories.length;count++){var C=new this.CatRecord({cat:F.queue.categories[count]});catstore.add(C)}this.fireEvent("load",this.storeQueue);this.fireEvent("speed",F.queue.kbpersec);this.fireEvent("limit",F.queue.speedlimit);this.fireEvent("status",F.queue.status);App.controllers.ApplicationController.fireEvent("updater");var E=new Date();console.log("Queue store loaded (%s ms)",(E.getTime()-B))}})},reload:function(B){var A=new Date();var C=A.getTime();Ext.Ajax.request({url:String.format("{0}tapi?mode=queue&start=START&limit=LIMIT&output=json&session={1}",App.host||"",SessionKey),scope:App.viewport.queue.grid,success:function(D){var G=Ext.decode(D.responseText);slots=G.queue.slots||[];for(count=this.store.getCount();count<slots.length;count++){var E=new Ext.data.Record();this.store.add(E)}for(count=slots.length;count<this.store.getCount();count++){this.store.removeAt(count)}for(count=0;count<slots.length;count++){if(slots[count].status=="Paused"){buttons='<img style="cursor: pointer;" onclick="queueresume(\''+slots[count].nzo_id+'\')" src="../static/images/play.png">'}else{buttons='<img style="cursor: pointer;" onclick="queuepause(\''+slots[count].nzo_id+'\')" src="../static/images/pause.png">'}buttons+=" ";buttons+='<img style="cursor: pointer;" onclick="queuedelete(\''+slots[count].nzo_id+'\')" src="../static/images/delete.png">';buttons+=" ";buttons+='<img style="cursor: pointer;" onclick="queueinfo(\''+slots[count].nzo_id+'\')" src="../static/images/info.png">';this.store.getAt(count).set("buttons",buttons);this.store.getAt(count).set("nzo_id",slots[count].nzo_id);this.store.getAt(count).set("filename",slots[count].filename);this.store.getAt(count).set("timeleft",slots[count].timeleft);this.store.getAt(count).set("size",App.controllers.QueueController.size(count,slots[count]));this.store.getAt(count).set("percentage",App.controllers.QueueController.percentageBar(count,slots[count]));this.store.getAt(count).set("avg_age",slots[count].avg_age);this.store.getAt(count).set("cat",slots[count].cat);this.store.getAt(count).set("status",App.controllers.QueueController.status(count,slots[count]))}App.controllers.QueueController.fireEvent("speed",G.queue.kbpersec);App.controllers.QueueController.fireEvent("status",G.queue.status);if(B){App.controllers.ApplicationController.fireEvent("updater")}var F=new Date();console.log("Queue store updated (%s ms)",(F.getTime()-C))}})},clear:function(){Ext.Ajax.request({url:String.format("{0}queue/purge?session={1}",App.host||"",SessionKey),success:function(A){App.controllers.QueueController.reload();console.log("Queue cleared")}})},limitspeed:function(A){Ext.Ajax.request({url:String.format("{0}tapi?mode=config&name=speedlimit&value={1}&session={2}",App.host||"",A.getValue(),SessionKey),success:function(B){console.log("Speed limited to %s KB/s",A.getValue())}})},specialkey:function(A,B){if(B.getKey()==B.ENTER){A.blur()}},setname:function(A,C,B){nzo_id=App.viewport.queue.grid.getSelectionModel().getSelected().get("nzo_id");Ext.Ajax.request({url:String.format("{0}tapi?mode=queue&name=rename&value={1}&value2={2}&session={3}",App.host||"",nzo_id,C,SessionKey),success:function(D){App.controllers.QueueController.reload();console.log('Changed name from "%s" to "%s" on "%s"',B,C,nzo_id)}})},setcat:function(A,C,B){nzo_id=App.viewport.queue.grid.getSelectionModel().getSelected().get("nzo_id");Ext.Ajax.request({url:String.format("{0}tapi?mode=change_cat&value={1}&value2={2}&session={3}",App.host||"",nzo_id,C,SessionKey),success:function(D){App.controllers.QueueController.reload();console.log('Changed categorie from "%s" to "%s" on "%s"',B,C,nzo_id)}})},showconfig:function(){App.ConfigWindow.show()}});SABnzbd.views.application.Head=Ext.extend(Ext.Panel,{initComponent:function(){Ext.applyIf(this,{height:80,layout:"border",items:[{region:"center",html:'<img src="../static/images/top.png">',bodyStyle:'background-image:url("../static/images/top_bg.png")',border:false}]});SABnzbd.views.queue.Index.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.application.Viewport=Ext.extend(Ext.Viewport,{initComponent:function(){this.head=new SABnzbd.views.application.Head({region:"north"});this.queue=new SABnzbd.views.queue.Index();this.history=new SABnzbd.views.history.Index();this.file=new SABnzbd.views.file.Grid();Ext.applyIf(this,{layout:"border",defaults:{border:false},items:[this.head,{region:"center",xtype:"tabpanel",border:false,bodyStyle:"border-width:1px 0",activeTab:0,items:[this.queue,this.history],listeners:{tabchange:function(A,B){App.controllers.ApplicationController.fireEvent("maintabchange",B.getItemId())}}},{region:"south",xtype:"tabpanel",deferredRender:false,height:200,activeTab:0,items:[this.file]}]});SABnzbd.views.application.Viewport.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.config.Index=Ext.extend(Ext.Window,{initComponent:function(){this.Main=new SABnzbd.views.config.Main({region:"center"});this.Menu=new SABnzbd.views.config.Menu({region:"west"});Ext.applyIf(this,{title:"Config",renderTo:Ext.getBody(),width:800,height:600,layout:"border",frame:false,items:[this.Main,this.Menu]});SABnzbd.views.config.Index.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.config.Main=Ext.extend(Ext.Panel,{initComponent:function(){Ext.applyIf(this,{defaults:{border:false},layout:"fit",frame:true});SABnzbd.views.config.Main.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.config.Menu=Ext.extend(Ext.grid.GridPanel,{initComponent:function(){Ext.applyIf(this,{store:new Ext.data.ArrayStore({data:[["General"],["Folders"],["Switches"],["Servers"],["Scheduling"],["RSS"],["Email"],["Index Sites"],["Categories"],["Sorting"]],fields:[{name:"menu"}]}),width:200,hideHeaders:true,title:"Menu",sm:new Ext.grid.RowSelectionModel({singleSelect:true,}),columns:[{sortable:false,width:196,resizable:false,dataIndex:"menu"}]});SABnzbd.views.config.Menu.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.file.Grid=Ext.extend(Ext.grid.GridPanel,{initComponent:function(){Ext.applyIf(this,{title:"Files",store:new Ext.data.Store(),autoExpandColumn:1,disableSelection:true,viewConfig:{getRowClass:function(A,D,B,C){if(A.get("status")=="finished"){return"finishedrow"}if(A.get("status")=="queued"){return"queuedrow"}}},columns:[{header:"Status",sortable:true,resizable:true,dataIndex:"status"},{header:"Filename",sortable:true,resizable:true,dataIndex:"filename"},{header:"%",sortable:true,resizable:true,dataIndex:"percentage"},{header:"Size",sortable:true,resizable:true,dataIndex:"size",align:"right"}]});SABnzbd.views.file.Grid.superclass.initComponent.apply(this,arguments);this.initListeners()},initListeners:function(){}});SABnzbd.views.history.Index=Ext.extend(Ext.Panel,{initComponent:function(){this.grid=new SABnzbd.views.history.Grid();Ext.applyIf(this,{title:"History",itemId:"history",defaults:{border:false},layout:"fit",items:[this.grid]});SABnzbd.views.history.Index.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.history.Grid=Ext.extend(Ext.grid.GridPanel,{initComponent:function(){this.Tbar=new SABnzbd.views.history.Tbar();Ext.applyIf(this,{store:new Ext.data.Store(),sm:new Ext.grid.RowSelectionModel({singleSelect:true,listeners:{beforerowselect:function(D,B,A,C){}}}),columns:[{header:"File",sortable:false,width:300,dataIndex:"name"},{header:"Category",sortable:false,width:60,dataIndex:"category"},{header:"Status",sortable:false,width:100,dataIndex:"status",align:"center"},{header:"Size",sortable:false,width:150,dataIndex:"size",align:"right"},{header:"Completed",sortable:false,width:150,dataIndex:"completed",align:"right"}],tbar:this.Tbar});SABnzbd.views.history.Grid.superclass.initComponent.apply(this,arguments);this.initListeners()},initListeners:function(){App.controllers.HistoryController.on({scope:this,load:function(A){this.reconfigure(A,this.getColumnModel())}})}});SABnzbd.views.history.Tbar=Ext.extend(Ext.Toolbar,{initComponent:function(){Ext.applyIf(this,{items:[{xtype:"button",text:"Clear",icon:"static/images/clear.png",disabled:true},{xtype:"tbseparator"},{xtype:"button",text:"Shutdown",icon:"static/images/quit.png",handler:function(){App.controllers.ApplicationController.shutdown()}},{xtype:"button",text:"Restart",icon:"static/images/restart.png",handler:function(){App.controllers.ApplicationController.restart()}},{xtype:"tbseparator"},{xtype:"button",text:"Config",icon:"static/images/config.png",disabled:true},{xtype:"tbfill"},{xtype:"displayfield",value:"Status:&nbsp;"},{xtype:"displayfield",value:"",id:"status"},{xtype:"tbseparator"},{xtype:"displayfield",fieldLabel:"Label",value:"Speed:&nbsp;"},{xtype:"displayfield",fieldLabel:"Label",value:0,itemId:"speed"},{xtype:"displayfield",fieldLabel:"Label",value:"KB/s"}]});SABnzbd.views.history.Tbar.superclass.initComponent.apply(this,arguments);this.initListeners()},initListeners:function(){App.controllers.QueueController.on({scope:this,speed:function(A){this.getComponent("speed").setValue(A)},status:function(A){this.getComponent("status").setValue(A)}})}});SABnzbd.views.queue.Index=Ext.extend(Ext.Panel,{initComponent:function(){this.grid=new SABnzbd.views.queue.Grid();Ext.applyIf(this,{title:"Queue",itemId:"queue",defaults:{border:false},layout:"fit",items:[this.grid]});SABnzbd.views.queue.Index.superclass.initComponent.apply(this,arguments)}});SABnzbd.views.queue.Grid=Ext.extend(Ext.grid.EditorGridPanel,{initComponent:function(){this.Tbar=new SABnzbd.views.queue.Tbar();Ext.applyIf(this,{store:new Ext.data.Store(),sm:new Ext.grid.RowSelectionModel({singleSelect:true,moveEditorOnEnter:false}),columns:[{header:"Control",sortable:false,width:55,resizable:false,dataIndex:"buttons"},{header:"Category",sortable:false,width:60,dataIndex:"cat",editor:{xtype:"combo",store:new Ext.data.Store(),triggerAction:"all",mode:"local",displayField:"cat",id:"queuecat",listeners:{change:function(A,C,B){App.controllers.QueueController.setcat(A,C,B)}}}},{header:"File",sortable:false,width:300,dataIndex:"filename",ColumnID:"filename",editor:{xtype:"textfield",listeners:{change:function(A,C,B){App.controllers.QueueController.setname(A,C,B)}}}},{header:"Status",sortable:false,width:100,dataIndex:"status",align:"center"},{header:"Percentage",sortable:false,width:150,dataIndex:"percentage",align:"center"},{header:"Total size",sortable:false,width:150,dataIndex:"size",align:"right"},{header:"ETA",sortable:false,width:100,dataIndex:"timeleft",align:"right"},{header:"Age",sortable:false,width:100,dataIndex:"avg_age",align:"right"}],tbar:this.Tbar});SABnzbd.views.queue.Grid.superclass.initComponent.apply(this,arguments);this.initListeners()},initListeners:function(){App.controllers.QueueController.on({scope:this,load:function(A){this.reconfigure(A,this.getColumnModel())}})}});SABnzbd.views.queue.Tbar=Ext.extend(Ext.Toolbar,{initComponent:function(){Ext.applyIf(this,{items:[{xtype:"button",text:"Add file",icon:"static/images/open.png",disabled:true},{xtype:"button",text:"Add URL",icon:"static/images/url.png",disabled:true},{xtype:"tbseparator"},{xtype:"button",text:"Pause",icon:"static/images/pause-big.png",disabled:true},{xtype:"button",text:"Clear",icon:"static/images/clear.png",handler:function(){App.controllers.QueueController.clear()}},{xtype:"tbseparator"},{xtype:"displayfield",fieldLabel:"Label",value:'<img src="static/images/network.png">&nbsp;'},{xtype:"tbtext",text:"Limit Speed:&nbsp;&nbsp;"},{xtype:"numberfield",fieldLabel:"Label",width:50,itemId:"limit",listeners:{change:function(A){App.controllers.QueueController.limitspeed(A)},specialkey:function(A,B){App.controllers.QueueController.specialkey(A,B)}}},{xtype:"tbtext",text:"KB/s"},{xtype:"tbseparator"},{xtype:"button",text:"Shutdown",icon:"static/images/quit.png",handler:function(){App.controllers.ApplicationController.shutdown()}},{xtype:"button",text:"Restart",icon:"static/images/restart.png",handler:function(){App.controllers.ApplicationController.restart()}},{xtype:"tbseparator"},{xtype:"button",text:"Config",icon:"static/images/config.png",handler:function(){App.controllers.QueueController.showconfig()}},{xtype:"tbfill"},{xtype:"displayfield",value:"Status:&nbsp;"},{xtype:"displayfield",value:"",id:"status"},{xtype:"tbseparator"},{xtype:"displayfield",fieldLabel:"Label",value:"Speed:&nbsp;"},{xtype:"displayfield",fieldLabel:"Label",value:0,itemId:"speed"},{xtype:"displayfield",fieldLabel:"Label",value:"KB/s"}]});SABnzbd.views.queue.Tbar.superclass.initComponent.apply(this,arguments);this.initListeners()},initListeners:function(){App.controllers.QueueController.on({scope:this,speed:function(A){this.getComponent("speed").setValue(A)},limit:function(A){this.getComponent("limit").setValue(A)},status:function(A){this.getComponent("status").setValue(A)}})}});