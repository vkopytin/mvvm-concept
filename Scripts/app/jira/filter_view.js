define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        hgn = require('hogan'),
        BaseView = require('app/jira/base_view'),
        FilterItemView = require('app/jira/filter_item_view'),
        
        filterTemplate = hgn.compile('<div class="form-group">\
<label>Filter By Status</label>\
  <div><button type="button" class="filter-reset btn btn-lg btn-primary">Reset</button></div>\
  <div class="filter-statuses"></div>\
</div>');

    function FilterView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: FilterView,
        init: function (opts) {
            BaseView.prototype.init.apply(this, arguments);
            this.$el = opts.el ? $(opts.el) : $('<div/>');
            
            this.drawItemsDelegate = _.bind(this.drawItems, this);
            
            $(this.eventDispatcher).on('change:statuses', this.drawItemsDelegate);
            this.views = [];
        },
        drawItem: function (item) {
            var view = new FilterItemView({
                viewModel: item,
                eventDispatcher: this.eventDispatcher
            }).appendTo($('.filter-statuses')).draw();
            
            this.views.push(view);
        },
        drawItems: function () {
            $('.filter-statuses').empty();
            _.each(this.items, function (view) {
                view.remove();
            });
            this.views = [];
            _.each(this.viewModel.getFilterItems(), this.drawItem, this);
        },
        remove: function () {
            $(document).off(this.drawItemsDelegate);
            
            _.each(this.items, function (view) {
                view.remove();
            });
            
            this.$el.remove();
        },
        draw: function () {
            var data = {
                },
                html = filterTemplate.render(data);
                
            this.$el.html(html);
            
            this.drawItems();
            
            return this;
        }
    });
});