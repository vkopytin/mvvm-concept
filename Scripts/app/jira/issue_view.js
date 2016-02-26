define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseView = require('app/jira/base_view'),
        itemTemplate = require('hgn!app/main/templates/jira.issue_item');
        
    function ItemView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: ItemView,
        init: function (opts) {
            BaseView.prototype.init.apply(this, arguments);
            this.$el = $('<tr/>');
        },
        draw: function () {
            var html = itemTemplate(this.viewModel.toJSON());
            
            this.$el.html(html);
            
            return this;
        }
    });
});