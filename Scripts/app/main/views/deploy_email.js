define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        template = require('hgn!main/templates/deploy_email'),
        emailTemplate = require('hgn!main/templates/deploy_email.email_template');

    return BB.View.extend({
        initialize: function () {
            this.listenTo(this.collection, 'sync', this.render, this);
        },
        appendTo: function ($el) {
            $el.append(this.$el);
            
            return this;
        },
        render: function () {
            var data = {
                    issues: this.collection.map(function (item, index) {
                        return _.extend({
                            index: index + 1
                        }, item.toJSON());
                    }),
                    subject: encodeURIComponent('Tomorrow deploy'),
                    body: encodeURIComponent('TBD')
                },
                html = template(data);
                
            this.$el.html(html);
            
            this.$('.auto-email').html(emailTemplate({
                'email-to': 'qa@rebelmouse.com',
                subject: encodeURIComponent('Tomorrow deploy'),
                body: encodeURIComponent(this.$('.email-contents').text())
            }));
            
            return this;
        }
    });
});
