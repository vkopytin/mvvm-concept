define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseView = require('app/jira/base_view'),
        template = require('hgn!app/jira/email_template'),
        emailTemplate = require('hgn!app/main/templates/deploy_email.email_template');
        
    function EmailView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: EmailView,
        init: function (opts) {
            BaseView.prototype.init.apply(this, arguments);
            this.$el = opts.el || $('<div/>');
            
            $(this.viewModel).on('change:issues', _.bind(this.draw, this));
        },
        remove: function () {
            this.$el.off();
            this.$el.empty();
            delete this.$el;
        },
        draw: function () {
            var data = {
                    issues: _.map(this.viewModel.getIssues(), function (viewModel) {
                        return viewModel.toJSON();
                    })
                },
                html = template(data);
            
            this.$el.html(html);
            
            $('.auto-email', this.$el).html(emailTemplate({
                'email-to': 'qa@rebelmouse.com',
                subject: encodeURIComponent('Tomorrow deploy'),
                body: encodeURIComponent($('.email-contents', this.$el).text())
            }));
            
            return this;
        }
    });
});