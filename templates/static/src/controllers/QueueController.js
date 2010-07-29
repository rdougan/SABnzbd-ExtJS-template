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
		this.on('updater',this.updater,this);
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
				this.fireEvent('updater');
			}
		});
	},
	
	/*
	 * The updater updates the queue grid. This should also update the file grid,
	 * the history gid etc. Maby this should be moved to another controller?
	 */
	updater: function() {
		setTimeout("App.controllers.QueueController.reload(true);",1000);
	},

	/*
	 * The reload function need some work. The reason why I did not just use the load
	 * function is because the load function removes the selectionmodel from the store
	 * and messes up the grid scrolling.
	 */
	reload: function (reload) {
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
				if (reload) App.controllers.QueueController.fireEvent('updater');
			}
		});
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
	},
	
	clear: function() {
		Ext.Ajax.request({
			url: String.format('{0}queue/purge?session={1}', App.host || '', SessionKey),
			success: function(response){
				App.controllers.QueueController.reload();
			}
		});
	}
});