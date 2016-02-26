define(function (require) {
    var $ = require('jquery'),
        MainView = require('vilynx/main_view'),
        MainCollection = require('vilynx/main_collection');

    return {
        init: function () {
            var collection = new MainCollection(),
                view = new MainView({
                    el: $('.vilynx-list'),
                    collection: collection
                }).render();
            
            collection.fetch({
                data: {
                    from: 0,
                    count: 5
                }
            });
            
        }
    };
});