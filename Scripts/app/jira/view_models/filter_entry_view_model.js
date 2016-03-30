define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseViewModel = require('app/jira/base/base_view_model'),
        Command = require('app/jira/command'),
        Model = require('app/jira/models/model');
        
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
            
            this.triggerProperyChanged('change:selected');
            
            model.toggleFilter('status', this.getId(), value);
        },
        init: function (opts) {
            var model = Model.getCurrent();
            BaseViewModel.prototype.init.apply(this, arguments);
            
            this.SelectCommand = new Command({ execute: this.onChangeSelected, scope: this });
            
            this.resetItemDelegate = _.bind(this.resetItem, this);
            $(model).on('model.filterReset', this.resetItemDelegate);
        },
        finish: function () {
            var model = Model.getCurrent();
            $(model).off('model.filterReset', this.resetItemDelegate);
            BaseViewModel.prototype.finish.apply(this, arguments);
        },
        onChangeSelected: function () {
            this.setSelected(!this.getSelected());
        },
        resetItem: function () {
            this.getSelected() && this.setSelected(false);
        }
    });
});