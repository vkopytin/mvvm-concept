define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        ModelBase = require('app/jira/model_base'),
        inst;
            
    function JiraModel () {
        ModelBase.prototype.constructor.apply(this, arguments);
    }
    
    return ModelBase.extend({
        ctor: JiraModel,
        init: function () {
            ModelBase.prototype.init.apply(this, arguments);
            this.currentFilter = {};
        },
        getIssues: function () {
            return this.issues;
        },
        setIssues: function (value) {
            this.issues = value;
            $(this).trigger('model.issues');
        },
        getStatuses: function () {
            return this.statuses;
        },
        setStatuses: function (value) {
            this.statuses = value;
            $(this).trigger('model.statuses');
        },
        resetFilter: function () {
            this.currentFilter = {};
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
            $.ajax({
                url: '/mvc/home/issues',
                type: 'GET',
                data: this.currentFilter,
                success: _.bind(function (items, success, xhr) {
                    //console.log('Issues: ' + items.length);
                    this.setIssues(items);
                }, this)
            });
        },
        fetchStatuses: function () {
            $.ajax({
                url: '/mvc/home/statuses',
                type: 'GET',
                success: _.bind(function (items, success, xhr) {
                    //console.log('Statuses: ' + items.length);
                    this.setStatuses(items);
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