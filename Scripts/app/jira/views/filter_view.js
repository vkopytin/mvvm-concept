define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseView = require('app/jira/base/base_view'),
        FilterItemView = require('app/jira/views/filter_item_view');

    function FilterView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: FilterView,
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
        filterStatuses: function () {
            return $('.filter-statuses', this.$el);
        },
        init: function (opts) {
            this.$el = opts.el ? $(opts.el) : $('<div/>');
            BaseView.prototype.init.apply(this, arguments);
            this.views = [];
            this.setItems(this.viewModel.getFilterItems());
        },
        drawItem: function (itemView) {
            itemView.appendTo(this.filterStatuses()).draw();
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