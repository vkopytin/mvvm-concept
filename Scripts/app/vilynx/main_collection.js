define(function (require) {
    var $ = require('jquery'),
        BB = require('backbone');
    
    return BB.Collection.extend({
        url: '/mvc/vilynx/items',
        
        parse: function (items, options) {
            this.from = items.from;
            this.count = items.count;
            return BB.Collection.prototype.parse.call(this, items.data, options);
        }
    });
});