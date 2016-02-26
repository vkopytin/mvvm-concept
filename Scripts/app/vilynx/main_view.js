define(function (require) {
    var $ = require('jquery'),
        BB = require('backbone'),
        template = require('hgn!vilynx/main_view_template'),
        itemTemplate = require('hgn!vilynx/item_view_template'),
        ItemView = BB.View.extend({
            events: {
                'click .close-video': 'render'
            },
            appendTo: function (el) {
                $(el).append(this.$el);
                return this;
            },
            render: function () {
                var data = this.model.toJSON(),
                    html = itemTemplate(data);
                    
                this.$el.html(html);
                
                return this;
            }
        });
    
    return BB.View.extend({
        events: {
                'click .page-next': 'pageNext',
                'click .page-prev': 'pagePrev'
        },
        initialize: function () {
            this.items = [];
            this.collection.on('sync', this.drawItems, this);
        },
        pageNext: function () {
            this.collection.fetch({
                data: {
                    from: this.collection.from + this.collection.count,
                    count: this.collection.count
                }
            });
        },
        pagePrev: function () {
            this.collection.fetch({
                data: {
                    from: this.collection.from <= this.collection.count ? 0 : this.collection.from - this.collection.count,
                    count: this.collection.count
                }
            });
        },
        drawItem: function (model) {
            var itemView = new ItemView({
                model: model
            }).appendTo(this.$('.vilynx-items')).render();
            this.items.push(itemView);
        },
        drawItems: function () {
            this.$('.vilynx-items').empty();
            this.collection.each(this.drawItem, this);
        },
        render: function () {
            var data = {},
                html = template(data);
                
            this.$el.html(html);
            
            return this;
        }
    });
});