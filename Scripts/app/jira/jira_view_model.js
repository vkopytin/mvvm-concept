define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseViewModel = require('app/jira/base_view_model'),
        FilterEntryViewModel = require('app/jira/filter_entry_view_model'),
        IssueEntryViewModel = require('app/jira/issue_entry_view_model'),
        Model = require('app/jira/model'),
        
        filters = [{
            id: 'Deploy',
            selected: false,
            name: 'Ready to Deploy'
        }, {
            id: '"Code Review"',
            selected: false,
            name: 'Code Review'
        }, {
            id: 'Backlog',
            selected: false,
            name: 'Backlog'
        }, {
            id: '"Selected for Development"',
            selected: false,
            name: 'Selected for Development'
        }, {
            id: 'Done',
            selected: false,
            name: 'Done'
        }];
            
    function JiraViewModel () {
        BaseViewModel.prototype.constructor.apply(this, arguments);
    }
    
    return BaseViewModel.extend({
        ctor: JiraViewModel,
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
        setStatuses: function (value) {
            var filterItems = this.filterItems;
            _.defer(function () {
                _.each(filterItems, function (viewModel) {
                    viewModel.remove();
                });
            }, 0);
            this.filterItems = value;
            $(this).trigger('change:statuses');
        },
        getFilterItems: function () {
            return this.filterItems;
        },
        getFilter: function () {
            var filterItems = _.reduce(this.filterItems, function (res, item) {
                if (item.getSelected()) {
                    res.push(item.getId());
                }
                
                return res;
            }, []);
            
            return {
                status: filterItems.join(',')
            };
        },
        init: function (opts) {
            var model = Model.getCurrent();
            BaseViewModel.prototype.init.apply(this, arguments);
            this.currentFiler = {};
            this.filterItems = _.map(filters, function (item) {
                return new FilterEntryViewModel(item);
            });
            
            $(model, this).on('model.issues', _.bind(this.changeIssues, this));
            $(model, this).on('model.statuses', _.bind(this.changeStatuses, this));
            
            _.defer(_.bind(function () {
                this.fetchStatuses();
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
        changeStatuses: function () {
            var model = Model.getCurrent(),
                statuses = model.getStatuses();
                
            this.setStatuses(_.map(statuses, function (item) {
                return new FilterEntryViewModel(item);
            }, this));
        },
        fetchIssues: function () {
            var model = Model.getCurrent();
            
            model.resetFilter();
        },
        fetchStatuses: function () {
            var model = Model.getCurrent();
            
            model.fetchStatuses();
        },
        remove: function () {
            var model = Model.getCurrent();
            
            $(model, this).off();
            BaseViewModel.prototype.remove.apply(this, arguments);
        }
    });
});