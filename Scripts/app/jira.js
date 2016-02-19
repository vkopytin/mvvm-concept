define(function (require) {
    var $ = require('jquery'),
        MainViewModel = require('app/jira/main_view_model'),
        MainView = require('app/jira/main_view'),
        uiDispatcher = require('app/jira/ui_dispatcher');

    return {
        init: function () {
            var eventDispatcher = uiDispatcher,
                view = new MainView({
                el: $('.jira-issues-list'),
                eventDispatcher: eventDispatcher,
                viewModel: new MainViewModel({
                    eventDispatcher: eventDispatcher
                })
            });
            
            view.draw();
        }
    };
});