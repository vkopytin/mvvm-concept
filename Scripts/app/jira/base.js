define(function (require) {
    var _ = require('underscore'),
        utils = require('app/jira/utils');
    
    function Base (opts) {
        //console.log('Created: ' + this.constructor.name);
        this.__name = this.constructor.name;
    }
    
    _.extend(Base.prototype, {
        init: function () {
            
        },
        remove: function () {
            //console.log('Removed: ' + this.constructor.name);
        }
    });
    
    Base.extend = utils.extend;
    
    return Base;
});