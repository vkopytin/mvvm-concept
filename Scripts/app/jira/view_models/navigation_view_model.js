define(function (require) {
    var BaseViewModel = require('app/jira/base/base_view_model'),
        Navigation = require('app/jira/navigation');
            
    function NavigationViewModel () {
        BaseViewModel.prototype.constructor.apply(this, arguments);
    }
    
    return BaseViewModel.extend({
        ctor: NavigationViewModel,
        init: function (opts) {
            BaseViewModel.prototype.init.apply(this, arguments);
        },
        navigateTo: function (name) {
            var navigation = Navigation.getInstance();
            
            navigation.loadComponent(name);
        }
    });
});