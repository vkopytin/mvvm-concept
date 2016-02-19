define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        ItemView = require('main/views/assembly_item');

    return BB.View.extend({
        initialize: function () {
            this.items = [];
            this.listenTo(this.collection, 'sync', this.drawItems, this);
        },
        appendTo: function ($el) {
            $el.append(this.$el);
            
            return this;
        },
        drawItem: function (model) {
            var view = _.find(this.items, function (childView) {
                return childView.model === model;
            });
            if (!view) {
                view = new ItemView({
                    model: model
                }).appendTo(this.$el).render();
                this.items.push(view);
            }
        },
        drawItems: function () {
            this.collection.each(_.bind(this.drawItem, this));
        },
        render: function () {
            return this;
        }
    });
});
