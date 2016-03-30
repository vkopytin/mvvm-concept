define(function (require) {
    var $ = require('jquery'),
        BaseViewModel = require('app/jira/base/base_view_model'),
        PageViewModel = require('app/jira/view_models/navigation_view_model'),
        navigation =

    // Inject debendencies
    BaseViewModel.prototype.navigation = new PageViewModel();

    return {
        init: function () {
            navigation.navigateTo('jira-report');
            return true;
        }
    };
});