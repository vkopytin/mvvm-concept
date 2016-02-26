define(function (require) {
    var $ = require('jquery'),
        BB = require('backbone'),
        template = require('hgn!main/templates/assembly_item');

    return BB.View.extend({
        tagName: 'li',
        initialize: function () {
        },
        appendTo: function ($el) {
            $el.append(this.$el);
            
            return this;
        },
        render: function () {
            var data = this.model.toJSON(),
                html = template(data);

            this.$el.html(html);

            return this;
        }
    });
});
