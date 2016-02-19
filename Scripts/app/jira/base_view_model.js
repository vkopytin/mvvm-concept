define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        utils = require('app/jira/utils');
        
    function ViewModelBase (opts) {
        this.init(opts);
    };
    
    _.extend(ViewModelBase.prototype, {
        init: function (opts) {
            this.opts = opts;
        },
        toJSON: function () {
            return this.opts;
        }
    });
    
    ViewModelBase.extend = utils.extend;
    
    return ViewModelBase;
});