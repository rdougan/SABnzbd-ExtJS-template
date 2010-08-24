Ext.grid.RowSelectionModel.override({
    getSelectedIndex: function(){
        return this.grid.store.indexOf(this.selections.itemAt(0));
    }
});
