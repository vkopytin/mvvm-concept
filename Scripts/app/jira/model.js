define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        ModelBase = require('app/jira/model_base'),
        inst;
            
    function JiraModel () {
    }
    
    return ModelBase.extend({
        ctor: JiraModel,
        fetchIssues: function (data, func, scope) {
            var res = $.Deferred();
            
            $.ajax({
                url: '/mvc/home/issues',
                type: 'GET',
                data: data,
                success: _.bind(function (items, success, xhr) {
                    func.call(scope || this, items);
                    res.resolve(items);
                }, this)
            });
            
            return res.promise();
        },
        fetchStatuses: function (func, scope) {
            var res = $.Deferred();
            
            $.ajax({
                url: '/mvc/home/statuses',
                type: 'GET',
                success: _.bind(function (items, success, xhr) {
                    func.call(scope || this, items);
                    res.resolve(items);
                }, this)
            });
            
            return res.promise();
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