define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseViewModel = require('app/jira/base/base_view_model'),
        Command = require('app/jira/command'),
        Model = require('app/jira/models/model');
        
    function FilterEpicViewModel () {
        BaseViewModel.prototype.constructor.apply(this, arguments);
    }
        
    return BaseViewModel.extend({
        ctor: FilterEpicViewModel,
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
            
            model.toggleFilter('epicLink', this.getId(), value);
        },
        init: function (opts) {
            var model = Model.getCurrent();
            BaseViewModel.prototype.init.apply(this, arguments);
            
            this.SelectCommand = new Command({ execute: this.onChangeSelected, scope: this });
            
            _.each({
                'model.filterReset': this.resetItemDelegate = _.bind(this.resetItem, this)
            }, function (h, e) { $(model).on(e, h); });
        },
        finish: function () {
            var model = Model.getCurrent();
            _.each({
                'model.filterReset': this.resetItemDelegate
            }, function (h, e) { $(model).off(e, h); });
            
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