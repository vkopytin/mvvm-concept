define(function (require) {
    var $ = require('jquery'),
        BaseView = require('app/jira/base/base_view'),
        template = require('hgn!app/jira/templates/panel_template');
        
    function PanelView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: PanelView,
        init: function (opts) {
            this.$el = opts.el ? $(opts.el) : $('<div />');
            BaseView.prototype.init.apply(this, arguments);
            this.opts = opts;
        },
        draw: function () {
            var data = {
                title: this.opts.title
            },
            html = template(data);
            
            this.$el.html(html);
            
            return this;
        }
    });
});