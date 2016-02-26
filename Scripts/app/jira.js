define(function (require) {
    var Page = require('app/page'),
        BaseViewModel = require('app/jira/base_view_model'),
        NavigationViewModel = require('app/jira/navigation_view_model'),
        PageViewModel = require('app/page_view_model');

    // Inject debendencies
    BaseViewModel.prototype.navigation = new NavigationViewModel();

    return {
        init: function () {
            new Page({
                viewModel: new PageViewModel()
            }); 
        }
    };
});