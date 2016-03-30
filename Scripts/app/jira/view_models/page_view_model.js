define(function (require) {
    var BaseViewModel = require('app/jira/base/base_view_model'),
        Command = require('app/jira/command'),
        Navigation = require('app/jira/navigation');
        
    function PageViewModel () {
        BaseViewModel.prototype.constructor.apply(this, arguments);
    }
        
    return BaseViewModel.extend({
        ctor: PageViewModel,
        init: function (opts) {
            BaseViewModel.prototype.init.apply(this, arguments);
            
            this.DeployEmailNavigateCommand = new Command({ execute: this.onDeployEmailNavigateCommand, scope: this });
            this.JiraReportNavigateCommand = new Command({ execute: this.onJiraReportNavigateCommand, scope: this });
        },
        onDeployEmailNavigateCommand: function () {
            this.navigation.navigateTo('deploy-email');
        },
        onJiraReportNavigateCommand: function () {
            this.navigation.navigateTo('jira-report');
        }
    });
});