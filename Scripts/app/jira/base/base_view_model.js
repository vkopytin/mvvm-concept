define(function (require) {
    var $ = require('jquery'),
        Base = require('app/jira/base/base');
        
    function ViewModelBase (opts) {
        Base.prototype.constructor.apply(this, arguments);
        this.init(opts);
        //console.log('Created: ' + this.constructor.name)
    };
    
    return Base.extend({
        ctor: ViewModelBase,
        init: function (opts) {
            Base.prototype.init.apply(this, arguments);
            
            this.opts = opts;
        },
        finish: function () {
            this.triggerProperyChanged('viewModel.finish');
            $(this).off();
            Base.prototype.finish.apply(this, arguments);
            //console.log('Removed: ' + this.constructor.name);
        },
        triggerProperyChanged: function (propertyName) {
            //console.log('ViewModel.trigger: ' + propertyName);
            $(this).trigger(propertyName);
        },
        navigateTo: function () {
            
        },
        navigateFrom: function () {
            this.finish();
        },
        toJSON: function () {
            return this.opts;
        }
    });
});