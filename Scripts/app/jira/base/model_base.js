define(function (require) {
    var $ = require('jquery'),
        Base = require('app/jira/base/base');
            
    function ModelBase () {
        Base.prototype.constructor.apply(this, arguments);
        this.init();
    }
    
    return Base.extend({
        ctor: ModelBase,
        init: function () {
            Base.prototype.init.apply(this, arguments);
        },
        triggerProperyChanged: function (propertyName) {
            //console.log('Model.trigger: ' + propertyName);
            $(this).trigger(propertyName);
        }
    });
});