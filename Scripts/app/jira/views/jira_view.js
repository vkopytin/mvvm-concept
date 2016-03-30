define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseView = require('app/jira/base/base_view'),
        FilterView = require('app/jira/views/filter_view'),
        EpicsView = require('app/jira/views/epics_view'),
        IssueView = require('app/jira/views/issue_view'),
        Utils = require('app/jira/utils'),
        template = require('hgn!app/jira/templates/jira_template');

    function JiraView () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: JiraView,
        commands: {
            'click.command .filter-reset': 'ResetFiltersCommand'
        },
        init: function (opts) {
            this.$el = opts.el ? $(opts.el) : $('<div/>');
            BaseView.prototype.init.apply(this, arguments);
            
            this.views = [];
            
            $(this.viewModel).on('change:issues', _.bind(this.drawItems, this));
        },
        drawItem: function (viewModel) {
            var view = new IssueView({
                viewModel: viewModel
            }).appendTo($('.issues-list')).draw();
            
            this.views.push(view);
        },
        drawItems: function () {
            var issues = this.viewModel.getIssues();
            this.views = [];
            _.each(issues, this.drawItem, this);
        },
        draw: function () {
            var data = {
                },
                html = template(data);
                
            this.$el.html(html);
            
            this.drawItems();
            
            return this;
        }
    });
});