define(function (require) {
    var BaseEventDispatcher = require('app/jira/base/base_event_dispatcher'),
        inst;
        
    function UIDispatcher () {
        BaseEventDispatcher.prototype.constructor.apply(this, arguments);
    }
    
    inst = new (BaseEventDispatcher.extend({
        ctor: UIDispatcher,
        init: function (opts) {
            BaseEventDispatcher.prototype.init.apply(this, arguments);
        }
    }))();
    
    return inst;
});