define(function (require) {
    var Base = require('app/jira/base/base');
    
    function BaseEventDispatcher (opts) {
        Base.prototype.constructor.apply(this, arguments);
        this.init(opts);
    }
    
    return Base.extend({
        ctor: BaseEventDispatcher,
        init: function (opts) {
            Base.prototype.init.apply(this, arguments);
        }
    });
});