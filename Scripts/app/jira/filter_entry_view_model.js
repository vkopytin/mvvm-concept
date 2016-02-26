define(function (require) {
    var $ = require('jquery'),
        BaseViewModel = require('app/jira/base_view_model'),
        Command = require('app/jira/command'),
        Model = require('app/jira/model');
        
    function FilterEntryViewModel () {
        BaseViewModel.prototype.constructor.apply(this, arguments);
    }
        
    return BaseViewModel.extend({
        ctor: FilterEntryViewModel,
        getId: function () {
            return this.opts.id;
        },
        getSelected: function () {
            return this.opts.selected;
        },
        setSelected: function (value) {
            var model = Model.getCurrent();
            this.opts.selected = value;
            $(this).trigger('change:selected');
            model.toggleFilter('status', this.getId(), value);
        },
        init: function (opts) {
            BaseViewModel.prototype.init.apply(this, arguments);
            
            this.SelectCommand = new Command({ execute: this.onChangeSelected, scope: this });
        },
        onChangeSelected: function () {
            this.setSelected(!this.getSelected());
        }
    });
});