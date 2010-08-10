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
		/**
		 * Debug timer start.
		 */
		var currentTime = new Date()
		var starttime = currentTime.getTime();

		Ext.Ajax.request({
			url  : String.format('{0}tapi?mode=queue&start=START&limit=LIMIT&output=json&session={1}', App.host || '', SessionKey),
			scope: this,
			
			success: function(response) {
				var o = Ext.decode(response.responseText);
				slots = o.queue.slots || [];
				cats = o.queue.categories || [];
					
				this.storeQueue = new Ext.data.JsonStore({
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

				/**
				 * This need a second look
				 */
				catstore = Ext.getCmp('queuecat').getStore();
				this.CatRecord = Ext.data.Record.create([
					'cat'
				]);
				for (count=catstore.getCount();count<o.queue.categories.length;count++){
					var Record = new this.CatRecord({
						cat: o.queue.categories[count]
					});
					catstore.add(Record);
				}
								
				this.fireEvent('load', this.storeQueue);
				this.fireEvent('speed', o.queue.kbpersec);
				this.fireEvent('limit', o.queue.speedlimit);
				this.fireEvent('status', o.queue.status);
				App.controllers.ApplicationController.fireEvent('updater');

				/**
				 * Debug msg to firebug with timer.
				 */
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
		/**
		 * Debug timer start.
		 */
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

				/**
				 * Debug msg to firebug with timer.
				 */
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

				/**
				 * Debug msg to firebug.
				 */
				console.log('Queue cleared');
			}
		});
	},
	
	limitspeed: function(t) {
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=config&name=speedlimit&value={1}&session={2}', App.host || '', t.getValue(), SessionKey),
			success: function(response){
				/**
				 * Debug msg to firebug.
				 */
				console.log('Speed limited to %s KB/s',t.getValue());
			}
		});
	},
	
	specialkey: function(t, e) {
		if (e.getKey() == e.ENTER) {
			t.blur();
		}
	},
	
	setname: function(t, n, o) {
		nzo_id = App.viewport.queue.grid.getSelectionModel().getSelected().get('nzo_id');
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=queue&name=rename&value={1}&value2={2}&session={3}', App.host || '', nzo_id, n, SessionKey),
			success: function(response){
				App.controllers.QueueController.reload();

				/**
				 * Debug msg to firebug.
				 */
				console.log('Changed name from "%s" to "%s" on "%s"', o, n, nzo_id);
			}
		});
	},

	setcat: function(t, n, o) {
		nzo_id = App.viewport.queue.grid.getSelectionModel().getSelected().get('nzo_id');
		Ext.Ajax.request({
			url: String.format('{0}tapi?mode=change_cat&value={1}&value2={2}&session={3}', App.host || '', nzo_id, n, SessionKey),
			success: function(response){
				App.controllers.QueueController.reload();

				/**
				 * Debug msg to firebug.
				 */
				console.log('Changed categorie from "%s" to "%s" on "%s"', o, n, nzo_id);
			}
		});
	}
});
