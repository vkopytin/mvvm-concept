define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        ModelBase = require('app/jira/base/model_base'),
        fetchIssuesXhr = null,
        fetchEpicsXhr = null,
        fetchStatusesXhr = null,
        inst;
            
    function JiraModel () {
        ModelBase.prototype.constructor.apply(this, arguments);
    }
    
    return ModelBase.extend({
        ctor: JiraModel,
        getIssues: function () {
            return this.issues;
        },
        setIssues: function (value) {
            this.issues = value;
            this.triggerProperyChanged('model.issues');
        },
        getStatuses: function () {
            return this.statuses;
        },
        setStatuses: function (value) {
            this.statuses = value;
            this.triggerProperyChanged('model.statuses');
        },
        getEpics: function () {
            return this.epics;
        },
        setEpics: function (value) {
            this.epics = value;
            this.triggerProperyChanged('model.epics');
        },
        init: function () {
            ModelBase.prototype.init.apply(this, arguments);
            this.currentFilter = {};
        },
        resetFilter: function (filter) {
            filter = filter || {};
            this.currentFilter = filter;
            this.triggerProperyChanged('model.filterReset');
            this.fetchIssues();
        },
        toggleFilter: function (key, value, enable) {
            var fval = this.currentFilter[key] || value,
                values = _.without(fval.split(','), value);
                
            if (enable) {
                values.push(value);
            }
            this.currentFilter[key] = values.join(',');
            this.fetchIssues();
        },
        fetchIssues: function () {
            fetchIssuesXhr && fetchIssuesXhr.abort();
            fetchIssuesXhr = $.ajax({
                url: '/home/issues',
                type: 'GET',
                data: this.currentFilter,
                success: _.bind(function (items, success, xhr) {
                    //console.log('Issues: ' + items.length);
                    this.setIssues(items);
                }, this)
            });
        },
        fetchStatuses: function () {
            fetchStatusesXhr && fetchStatusesXhr.abort();
            fetchStatusesXhr = $.ajax({
                url: '/home/statuses',
                type: 'GET',
                success: _.bind(function (items, success, xhr) {
                    //console.log('Statuses: ' + items.length);
                    this.setStatuses(items);
                }, this)
            });
        },
        fetchEpics: function () {
            fetchEpicsXhr && fetchEpicsXhr.abort();
            fetchEpicsXhr = $.ajax({
                url: '/home/epics',
                type: 'GET',
                success: _.bind(function (items, success, xhr) {
                    //console.log('Statuses: ' + items.length);
                    this.setEpics(items);
                }, this)
            });
        }
    }, {
        getCurrent: function () {
            if (inst) {
                return inst;
            }
            
            inst = new JiraModel();
            
            return inst;
        }
    });
});