define(function (require) {
    var _ = require('underscore'),
        utils = require('app/jira/utils');
    
    function BaseEventDispatcher (opts) {
        this.init(opts);
    }
    
    _.extend(BaseEventDispatcher.prototype, {
        init: function (opts) {
        }
    });
    
    BaseEventDispatcher.extend = utils.extend;
    
    return BaseEventDispatcher;
});