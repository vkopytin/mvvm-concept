define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseView = require('app/jira/base_view'),
        template = require('hgn!app/main/templates/jira.filter_item');
        
    function FilterItemView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: FilterItemView,
        getInput: function () {
            return $('button', this.$el);
        },
        commands: {
            'click .status-name': 'SelectCommand'
        },
        change: {
            'selected': 'onChangeSelected'
        },
        init: function (opts) {
            BaseView.prototype.init.apply(this, arguments);
            this.$el = $('<span />');
            
            this.onChangeSelectedDelegate = _.bind(this.onChangeSelected, this);
            
            this.$el.on('click', '.status-name', _.bind(this.onClickHandler, this));
            $(this.viewModel).on('change:selected', this.onChangeSelectedDelegate);
        },
        onClickHandler: function (evnt) {
            var command = this.viewModel.SelectCommand;
                
            command.execute();
        },
        onChangeSelected: function () {
            var $el = this.getInput(),
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