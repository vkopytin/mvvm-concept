define(function (require) {
    var _ = require('underscore'),
        utils = require('app/jira/utils'),
        report = {};
    
    window.report = report;
    
    function Base (opts) {
        //console.log('Created: ' + this.constructor.name);
        this.__name = this.constructor.name;
        report[this.__name] = ++report[this.__name] || 1;
    }
    
    _.extend(Base.prototype, {
        init: function () {
            this.isFinish = false;
        },
        finish: function () {
            //console.log('Removed: ' + this.constructor.name);
            report[this.__name] = --report[this.__name];
            if (this.isFinish) {
                throw('Warinig: Object is removed two times.');
            }
            this.isFinish = true;
        }
    });
    
    Base.extend = utils.extend;
    
    return Base;
});