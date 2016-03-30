define(function (require) {
    var Base = require('app/jira/base/base');
    
    function Command (opts) {
        Base.prototype.constructor.apply(this, arguments);
        this.init(opts);
    }
    
    Base.extend({
        ctor: Command,
        init: function (opts) {
            Base.prototype.init.apply(this, arguments);
            
            this.handler = opts.execute;
            this.scope = opts.scope || this;
        },
        execute: function () {
            this.handler.apply(this.scope, arguments);
        }
    });
    
    return Command;
});