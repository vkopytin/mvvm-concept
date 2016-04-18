define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Base = require('app/jira/base/base');
    
    function BaseView (opts) {
        Base.prototype.constructor.apply(this, arguments);
        this.init(opts);
        //console.log('Created: ' + this.constructor.name)
    }
    
    return Base.extend({
        ctor: BaseView,
        commands: {
            // declare commands from the child view
        },
        bindings: {
            // declare binding rules from the child view
        },
        init: function (opts) {
            Base.prototype.init.apply(this, arguments);
            
            this.viewModel = opts.viewModel;
            var bindings = _.extend({},
                _.result(this, 'bindings'),
                _.result(opts, 'bindings') || {}
            );
            
            $(this.viewModel).on('viewModel.finish', _.bind(this.finish, this));
            
            this.initBindings(bindings);
            this.initCommands(_.result(this, 'commands'));
            this.$el.toggleClass('highlight', true);
            this.$el.attr('data-type', this.__name);
        },
        finish: function () {
            this.$el.off();
            this.$el.remove();
            delete this.$el;
            Base.prototype.finish.apply(this, arguments);
            //console.log('Removed: ' + this.constructor.name);
        },
        initBindings: function (bindings) {
            _.each(bindings, function (value, key) {
                var value = value, key = key;
                $(this.viewModel).on(key, _.bind(function () {
                    value.call(this, this, this.viewModel);
                }, this));
            }, this);
        },
        initCommands: function (commands) {
            _.each(commands, function (value, key) {
                var pair = key.split(/\s+/);
                $(this.$el).on(pair[0], pair[1], _.bind(function (evnt) {
                    var command = this.viewModel[value];
                    
                    command.execute();
                }, this));
            }, this);
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
        draw: function () {
            return this;
        }
    });
});