define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseViewModel = require('app/jira/base_view_model');
        
    function FilterEntryViewModel () {
        BaseViewModel.prototype.constructor.apply(this, arguments);
    }
        
    return BaseViewModel.extend({
        ctor: FilterEntryViewModel,
        init: function (opts) {
            BaseViewModel.prototype.init.apply(this, arguments);
        }
    });
});