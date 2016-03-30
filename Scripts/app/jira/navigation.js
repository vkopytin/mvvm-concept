define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Base = require('app/jira/base/base'),
        components = {
            'jira-report': ['app/jira/pages/jira_page', 'app/jira/view_models/jira_view_model'],
            'deploy-email': ['app/jira/pages/email_page', 'app/jira/view_models/email_view_model']
        },
        inst;
    
    function Navigation(opts) {
        Base.prototype.constructor.apply(this, arguments);
        this.init(opts);
    }
    
    return Base.extend({
        ctor: Navigation,
        init: function (opts) {
            Base.prototype.init.apply(this, arguments);
        },
        getView: function () {
            var match = (window || this).location.href.match(/#(.*)$/);
            return match ? match[1] : '';
        },
        setHash: function (hashPath) {
            window.location.hash = '#' + hashPath;
        },
        loadComponent: function (componentName) {
            var inst = this,
                deps = components[componentName];
                
            this.view && _.defer(_.bind(this.view.onNavigateFrom, this.view), 0);
            this.setHash(componentName);
            
            if (deps) {
                require(deps, function (View, ViewModel) {
                    inst.view = new View({
                        el: $(document.body),
                        viewModel: new ViewModel()
                    }).draw();
                    
                    _.defer(_.bind(inst.view.onNavigateTo, inst.view), 0);
                });
            }
        }
    }, {
        getInstance: function () {
            if (inst) {
                return inst;
            }
        
            return inst = new Navigation();
        }
    });
});