define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        //BaseViewModel = require('app/jira/base/base_view_model'),
        BaseViewModel = require('app/jira/view_models/page_view_model'),
        FilterEntryViewModel = require('app/jira/view_models/filter_entry_view_model'),
        FilterEpicViewModel = require('app/jira/view_models/filter_epic_view_model'),
        IssueEntryViewModel = require('app/jira/view_models/issue_entry_view_model'),
        Command = require('app/jira/command'),
        Model = require('app/jira/models/model'),
        Utils = require('app/jira/utils'),
        
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
                    viewModel.finish();
                });
            }, 0);
            this.issues = value;
            this.triggerProperyChanged('change:issues');
        },
        getFilterItems: function () {
            return this.filterItems;
        },
        setStatuses: function (value) {
            var filterItems = this.filterItems;
            _.defer(function () {
                _.each(filterItems, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.filterItems = value;
            this.triggerProperyChanged('change:statuses');
        },
        getEpics: function () {
            return this.epics;
        },
        setEpics: function (value) {
            var epics = this.epics;
            _.defer(function () {
                _.each(epics, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.epics = value;
            this.triggerProperyChanged('change:epics');
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
            
            this.ResetFiltersCommand = new Command({ execute: this.onResetFilters, scope: this });

            _.each({
                'model.issues': this.changeIssuesDelegate = _.bind(this.changeIssues, this),
                'model.statuses': this.changeStatusesDelegate = _.bind(this.changeStatuses, this),
                'model.epics': this.changeEpicsDelegate = _.bind(this.changeEpics, this)
            }, function (h, e) { $(model).on(e, h); });
            
            _.defer(_.bind(function () {
                this.fetchStatuses();
                this.fetchIssues();
                this.fetchEpics();
            }, this), 0);
        },
        finish: function () {
            var model = Model.getCurrent();
            _.each({
                'model.issues': this.changeIssuesDelegate,
                'model.statuses': this.changeStatusesDelegate,
                'model.epics': this.changeEpicsDelegate
            }, function (h, e) { $(model).off(e, h); });
            this.setIssues([]);
            this.setEpics([]);
            this.setStatuses([]);
            
            BaseViewModel.prototype.finish.apply(this, arguments);
        },
        onResetFilters: function () {
            var model = Model.getCurrent();
            model.resetFilter();
        },
        changeIssues: function () {
            var model = Model.getCurrent(),
                issues = model.getIssues();
                
            this.setIssues(_.map(issues, function (item) {
                return new IssueEntryViewModel(item);
            }, this));
        },
        changeStatuses: function () {
            var model = Model.getCurrent(),
                statuses = model.getStatuses();
                
            this.setStatuses(_.map(statuses, function (item) {
                return new FilterEntryViewModel(item);
            }, this));
        },
        changeEpics: function () {
            var model = Model.getCurrent(),
                epics = model.getEpics();
                
            this.setEpics(_.map(epics, function (item) {
                return new FilterEpicViewModel({
                    id: item.Key,
                    selected: false,
                    name: item.fields.summary
                });
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
        fetchEpics: function () {
            var model = Model.getCurrent();
            model.fetchEpics();
        }
    });
});