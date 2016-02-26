define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseView = require('app/jira/base_view'),
        FilterView = require('app/jira/filter_view'),
        IssueView = require('app/jira/issue_view'),
        template = require('hgn!app/main/templates/jira.issues_list');

    function JiraView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: JiraView,
        init: function (opts) {
            BaseView.prototype.init.apply(this, arguments);
            this.$el = opts.el ? $(opts.el) : $('<div/>');
            
            this.views = [];
            
            $(this.viewModel).on('change:issues', _.bind(this.drawItems, this));
        },
        drawItem: function (item) {
            var view = new IssueView({
                viewModel: item
            }).appendTo($('.issues-list')).draw();
            
            this.views.push(view);
        },
        drawItems: function () {
            var issues = this.viewModel.getIssues();
            this.views = [];
            _.each(issues, this.drawItem, this);
        },
        remove: function () {
            this.$el.off();
            this.$el.empty();
            delete this.$el;
        },
        draw: function () {
            var data = {
                },
                html = template(data);
                
            this.$el.html(html);
            
            new FilterView({
                el: $('.filter-items'),
                viewModel: this.viewModel
            }).draw();
            
            this.drawItems();
            
            return this;
        }
    });
});