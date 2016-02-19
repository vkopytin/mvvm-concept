define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        hgn = require('hogan'),
        BaseView = require('app/jira/base_view'),
        
        filterItemTemplate = hgn.compile('\
      <button type="button" data-command="Select" class="btn btn-sm btn-{{#selected}}primary{{/selected}}{{^selected}}default{{/selected}} status-name" title="{{description}}" style="margin: 4px 6px;">{{name}}</button>\
  ');
        
    function FilterItemView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: FilterItemView,
        getInput: function () {
            return $('button', this.$el);
        },
        init: function (opts) {
            BaseView.prototype.init.apply(this, arguments);
            this.$el = $('<span />');
            
            this.onChangeSelectedDelegate = _.bind(this.onChangeSelected, this);
            
            this.$el.on('click', '.status-name', _.bind(this.onClickHandler, this));
            $(this.eventDispatcher).on('change:filter', this.onChangeSelectedDelegate);
        },
        remove: function () {
            $(this.eventDispatcher).off('change:filter', this.onChangeSelectedDelegate);
            this.$el.remove();
        },
        onClickHandler: function (evnt) {
            var commandName = $(evnt.currentTarget).data('command'),
                command = this.viewModel[commandName + 'Command'];
                
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
                html = filterItemTemplate.render(data);
                
            this.$el.html(html);
            
            return this;
        }
    });
});