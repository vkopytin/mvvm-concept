define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseView = require('app/jira/base/base_view'),
        FilterItemView = require('app/jira/views/filter_item_view');

    function EpicsView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: EpicsView,
        setItems: function (items) {
            this.views = [];
            _.each(items, function (item) {
                var view = new FilterItemView({
                    viewModel: item
                });
                this.views.push(view);
            }, this);
            
            this.drawItems();
        },
        filterEpics: function () {
            return $('.filter-epics', this.$el);
        },
        init: function (opts) {
            this.$el = opts.el ? $(opts.el) : $('<div/>');
            BaseView.prototype.init.apply(this, arguments);
            this.views = [];
        },
        drawItem: function (itemView) {
            itemView.appendTo(this.filterEpics()).draw();
        },
        drawItems: function () {
            _.each(this.views, this.drawItem, this);
        },
        draw: function () {
            this.drawItems();
            
            return this;
        }
    });
});