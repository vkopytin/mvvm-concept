define(function (require) {
    var $ = require('jquery'),
        Base = require('app/jira/base');
        
    function ViewModelBase (opts) {
        Base.prototype.constructor.apply(this, arguments);
        this.init(opts);
        //console.log('Created: ' + this.constructor.name)
    };
    
    return Base.extend({
        ctor: ViewModelBase,
        init: function (opts) {
            Base.prototype.init.apply(this, arguments);
            
            this.opts = opts;
        },
        toJSON: function () {
            return this.opts;
        },
        navigateTo: function () {
            
        },
        navigateFrom: function () {
            this.remove();
        },
        remove: function () {
            $(this).trigger('model.remove');
            $(this).off();
            Base.prototype.remove.apply(this, arguments);
            //console.log('Removed: ' + this.constructor.name);
        }
    });
});