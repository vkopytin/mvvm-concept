define(function (require) {
    var BaseViewModel = require('app/jira/base/base_view_model');
        
    function IssueEntryViewModel () {
        BaseViewModel.prototype.constructor.apply(this, arguments);
    }
        
    return BaseViewModel.extend({
        ctor: IssueEntryViewModel,
        init: function (opts) {
            BaseViewModel.prototype.init.apply(this, arguments);
        },
        finish: function () {
            BaseViewModel.prototype.finish.apply(this, arguments);
        }
    });
});