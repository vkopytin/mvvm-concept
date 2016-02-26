define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseViewModel = require('app/jira/base_view_model'),
        IssueEntryViewModel = require('app/jira/issue_entry_view_model'),
        Model = require('app/jira/model');
        
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
                    viewModel.remove();
                });
            }, 0);
            this.issues = value;
            $(this).trigger('change:issues');
        },
        init: function (opts) {
            var model = Model.getCurrent();
            
            BaseViewModel.prototype.init.apply(this, arguments);
            
            $(model, this).on('model.issues', _.bind(this.changeIssues, this));
            
            _.defer(_.bind(function () {
                this.fetchIssues();
            }, this), 0);
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
            
            model.toggleFilter('status', '10009', true);
        },
        remove: function () {
            var model = Model.getCurrent();
            
            $(model, this).off();
            BaseViewModel.prototype.remove.apply(this, arguments);
        }
    });
});