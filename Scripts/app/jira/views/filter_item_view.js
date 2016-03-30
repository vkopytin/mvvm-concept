define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseView = require('app/jira/base/base_view'),
        template = require('hgn!app/jira/templates/filter_item_template');
        
    function FilterItemView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: FilterItemView,
        button: function () {
            return $('button', this.$el);
        },
        commands: {
            'click.command .status-name': 'SelectCommand'
        },
        init: function (opts) {
            this.$el = $('<span />');
            BaseView.prototype.init.apply(this, arguments);
            
            $(this.viewModel).on('change:selected', _.bind(this.onChangeSelected, this));
        },
        onChangeSelected: function () {
            var $el = this.button(),
                isSelected = !!this.viewModel.getSelected();
            
            $el.toggleClass('btn-primary', isSelected);
            $el.toggleClass('btn-default', !isSelected);
        },
        draw: function () {
            var data = this.viewModel.toJSON(),
                html = template(data);
                
            this.$el.html(html);
            
            return this;
        }
    });
});