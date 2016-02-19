define(function (require) {
    var _ = require('underscore'),
        utils = require('app/jira/utils');
    
    function Command (opts) {
        this.init(opts);
    }
    
    _.extend(Command.prototype, {
        init: function (opts) {
            this.handler = opts.execute;
            this.scope = opts.scope || this;
        },
        execute: function () {
            this.handler.apply(this.scope, arguments);
        }
    });
    
    Command.extend = utils.extend;
    
    return Command;
});