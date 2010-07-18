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
