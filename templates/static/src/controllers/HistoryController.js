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