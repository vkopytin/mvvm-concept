define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        utils = require('app/jira/utils');
    
    function BaseView (opts) {
        this.init(opts);
    }
    
    _.extend(BaseView.prototype, {
        init: function (opts) {
            this.viewModel = opts.viewModel;
            this.eventDispatcher = opts.eventDispatcher;
        },
        appendTo: function (el) {
            $(el).append(this.$el);
            
            return this;
        },
        remove: function () {
            
        },
        draw: function () {
            return this;
        }
    });
    
    BaseView.extend = utils.extend;
    
    return BaseView;
});