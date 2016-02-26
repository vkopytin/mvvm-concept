define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Base = require('app/jira/base');
    
    function BaseView (opts) {
        Base.prototype.constructor.apply(this, arguments);
        this.init(opts);
        //console.log('Created: ' + this.constructor.name)
    }
    
    return Base.extend({
        ctor: BaseView,
        init: function (opts) {
            Base.prototype.init.apply(this, arguments);
            
            this.viewModel = opts.viewModel;
            
            $(this.viewModel).on('model.remove', _.bind(this.remove, this));
        },
        appendTo: function (el) {
            $(el).append(this.$el);
            
            return this;
        },
        onNavigateTo: function () {
            this.viewModel && this.viewModel.navigateTo();
        },
        onNavigateFrom: function () {
            this.viewModel && this.viewModel.navigateFrom();
        },
        remove: function () {
            this.$el.off();
            this.$el.remove();
            delete this.$el;
            Base.prototype.remove.apply(this, arguments);
            //console.log('Removed: ' + this.constructor.name);
        },
        draw: function () {
            return this;
        }
    });
});