define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseViewModel = require('app/jira/base_view_model'),
        Command = require('app/jira/command');
        
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
            this.opts.selected = value;
            $(this.opts.eventDispatcher).trigger('change:filter');
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