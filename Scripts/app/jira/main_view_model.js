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
            
    function MainViewModel () {
        BaseViewModel.prototype.constructor.apply(this, arguments);
    }
    
    return BaseViewModel.extend({
        ctor: MainViewModel,
        getIssues: function () {
            return this.issues;
        },
        setIssues: function (value) {
            this.issues = value;
            $(this.opts.eventDispatcher).trigger('change:issues');
        },
        setStatuses: function (value) {
            this.filterItems = value;
            $(this.opts.eventDispatcher).trigger('change:statuses');
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
            BaseViewModel.prototype.init.apply(this, arguments);
            this.currentFiler = {};
            this.filterItems = _.map(filters, function (item) {
                return new FilterEntryViewModel(item);
            });
            
            _.defer(_.bind(function () {
                this.fetchStatuses();
                this.fetchIssues();
            }, this), 0);
            
            $(this.opts.eventDispatcher).on('change:filter', _.bind(this.fetchIssues, this));
        },
        fetchIssues: function () {
            var model = Model.getCurrent();
            
            model.fetchIssues(this.getFilter(), function (items) {
                this.setIssues(_.map(items, function (item) {
                    return new IssueEntryViewModel(_.extend(item, {
                        eventDispatcher: this.opts.eventDispatcher
                    }));
                }, this));
            }, this);
        },
        fetchStatuses: function () {
            var model = Model.getCurrent();
            
            model.fetchStatuses(function (items) {
                this.setStatuses(_.map(items, function (item) {
                    return new FilterEntryViewModel(_.extend(item, {
                        eventDispatcher: this.opts.eventDispatcher
                    }));
                }, this));
            }, this);
        }
    });
    
    return MainViewModel;
});