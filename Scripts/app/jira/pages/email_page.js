define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        EmailView = require('app/jira/views/email_view'),
        BaseView = require('app/jira/base/base_view'),
        Base = require('app/jira/base/base'),
        Utils = require('app/jira/utils'),
        template = require('hgn!app/jira/templates/page_template');
        
    function EmailPage () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: EmailPage,
        commands: {
            'click.command .jira-deploy-email': 'DeployEmailNavigateCommand',
            'click.command .jira-jira-report': 'JiraReportNavigateCommand'
        },
        handlers: {
            onDraw: function () {
                $('#main-menu').metisMenu();
            }
        },
        init: function (options) {
            this.$el = options.el || $(document.body);
            _.extend(this.handlers, options.handlers || {});
            
            BaseView.prototype.init.apply(this, arguments);
        },
        finish: function () {
            this.$el.off();
            this.$el.empty();
            delete this.$el;
            Base.prototype.finish.apply(this, arguments);
        },
        draw: function () {
            var data = {},
                html = template(data);
                
            this.$el.html(html);
            
            Utils.loadViews({
                emailView: ['app/jira/views/email_view', {
                    el: '#page-wrapper',
                    viewModel: this.viewModel
                }]
            }, this);
                        
            this.handlers.onDraw.call(this);
            
            return this;              
        }
    });
});