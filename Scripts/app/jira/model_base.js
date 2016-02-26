define(function (require) {
    var Base = require('app/jira/base');
            
    function ModelBase () {
        Base.prototype.constructor.apply(this, arguments);
        this.init();
    }
    
    return Base.extend({
        ctor: ModelBase,
        init: function () {
            Base.prototype.init.apply(this, arguments);
        }
    });
});