define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        //BaseViewModel = require('app/jira/base/base_view_model'),
        BaseViewModel = require('app/jira/view_models/page_view_model'),
        IssueEntryViewModel = require('app/jira/view_models/issue_entry_view_model'),
        Model = require('app/jira/models/model');
        
    function EmailViewModel () {
        BaseViewModel.prototype.constructor.apply(this, arguments);
    }
        
    return BaseViewModel.extend({
        ctor: EmailViewModel,
        getIssues: function () {
            return this.issues;
        },
        setIssues: function (value) {
            var issues = this.issues;
            _.defer(function () {
                _.each(issues, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.issues = value;
            this.triggerProperyChanged('change:issues');
        },
        init: function (opts) {
            var model = Model.getCurrent();
            BaseViewModel.prototype.init.apply(this, arguments);
            
            this.changeIssuesDelegate = _.bind(this.changeIssues, this);
            $(model).on('model.issues', this.changeIssuesDelegate);
            
            _.defer(_.bind(function () {
                this.fetchIssues();
            }, this), 0);
        },
        finish: function () {
            var model = Model.getCurrent();
            $(model).off('model.issues', this.changeIssuesDelegate);
            this.setIssues([]);
            BaseViewModel.prototype.finish.apply(this, arguments);
        },
        changeIssues: function () {
            var model = Model.getCurrent(),
                issues = model.getIssues();
                
            this.setIssues(_.map(issues, function (item) {
                return new IssueEntryViewModel(item);
            }));
        },
        fetchIssues: function () {
            var model = Model.getCurrent();
            model.resetFilter({
                status: '10009'
            });
        }
    });
});