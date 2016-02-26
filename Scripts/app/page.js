define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        Navigation = require('app/jira/navigation'),
        BaseView = require('app/jira/base_view'),
        template = require('hgn!app/page_template');
        
    function Page () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: Page,
        init: function (options) {
            this.$el = options.el || $(document.body);
            
            BaseView.prototype.init.apply(this, arguments);
            
            this.$el.on('click', '.jira-deploy-email', _.bind(this.onDeployEmailHandler, this));
            this.$el.on('click', '.jira-jira-report', _.bind(this.onJiraReportHandler, this));
            
            _.defer(_.bind(this.draw, this), 0);
        },
        onDeployEmailHandler: function () {
            var command = this.viewModel.DeployEmailNavigateCommand;
            
            command.execute();
        },
        onJiraReportHandler: function () {
            var command = this.viewModel.JiraReportNavigateCommand;
            
            command.execute();
        },
        draw: function () {
            var data = {},
                html = template(data);
                
            this.$el.html(html);
            
            this.onJiraReportHandler(); 
            
            return this;              
        }
    });
});