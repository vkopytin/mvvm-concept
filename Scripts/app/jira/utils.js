define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        impl;
    
    return impl = {
        extend: function (protoProps, staticProps) {
            var parent = this;
            var child;

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && _.has(protoProps, 'ctor')) {
                child = protoProps.ctor;
            } else {
                child = function(){ return parent.apply(this, arguments); };
            }

            // Add static properties to the constructor function, if supplied.
            _.extend(child, parent, staticProps);

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            var Surrogate = function(){ this.constructor = child; };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) _.extend(child.prototype, protoProps);

            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype;

            return child;
        },
        loadViews: function (jsml, view) {
            var queue = null;
            _.each(jsml, function (item, propName) {
                var res = $.Deferred(),
                    typeName = item[0],
                    options = item[1],
                    subViews = item[2];
                    
                require([typeName], function (SubView) {
                    view[propName] = new SubView(_.extend({}, options, {
                        el: $(options.el, view.$el)
                    })).draw();
                    res.resolve(view[propName]);
                    
                    impl.loadViews(subViews, view[propName]);
                });
                queue = $.when(queue, res.promise());
            });
           
           return queue;
        }
    };
});