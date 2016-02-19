define(function (require) {
    var _ = require('underscore'),
        utils = require('app/jira/utils');
            
    function ModelBase () {
    }
    
    _.extend(ModelBase.prototype, {
        ctor: ModelBase,
        init: function () {
            
        }
    });
    
    ModelBase.extend = utils.extend;
    
    return ModelBase;
});