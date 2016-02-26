define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseView = require('app/jira/base_view'),
        FilterItemView = require('app/jira/filter_item_view');

    function FilterView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: FilterView,
        init: function (opts) {
            BaseView.prototype.init.apply(this, arguments);
            this.$el = opts.el ? $(opts.el) : $('<div/>');
            this.views = [];
            
            this.drawItemsDelegate = _.bind(this.drawItems, this);
            
            $(this.viewModel).on('change:statuses', this.drawItemsDelegate);
        },
        drawItem: function (item) {
            var view = new FilterItemView({
                viewModel: item
            }).appendTo($('.filter-statuses')).draw();
            
            this.views.push(view);
        },
        drawItems: function () {
            this.views = [];
            _.each(this.viewModel.getFilterItems(), this.drawItem, this);
        },
        draw: function () {
            this.drawItems();
            
            return this;
        }
    });
});