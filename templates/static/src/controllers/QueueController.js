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