define(function (require) {
    var $ = require('jquery'),
        BB = require('backbone'),
        Assemblies = require('main/collections/assemblies'),
        AssembliesView = require('main/views/assemblies'),
        Issues = require('main/collections/jira.issues'),
        IssuesView = require('main/views/jira.issues'),
        DeployEmail = require('main/views/deploy_email'),
        MainRouter = BB.Router.extend({
            routes: {
                'jira': 'jira',
                'deploy-email': 'deployEmail',
                '*home': 'home'
            },
            home: function () {
                var assemblies = new Assemblies();
                currentView && currentView.remove();
                currentView = new AssembliesView({
                    collection: assemblies
                }).appendTo($('.jira-issues-list')).render();

                assemblies.fetch();
            },
            jira: function () {
                var issues = new Issues();
                currentView && currentView.remove();
                currentView = new IssuesView({
                    collection: issues
                }).appendTo($('.jira-issues-list')).render();

                issues.fetch();
            },
            deployEmail: function () {
                var issues = new Issues();
                currentView && currentView.remove();
                currentView = new DeployEmail({
                   collection: issues
                }).appendTo($('.jira-issues-list')).render();
                
                issues.fetch({
                    data: {
                        status: 'Deploy'
                    }
                });
            }
        }),
        currentView = null;

    return {
        init: function () {
            var router = new MainRouter();
            Backbone.history.start();
        }
    };
});
