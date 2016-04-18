define(function (require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        BaseView = require('app/jira/base/base_view'),
        Base = require('app/jira/base/base'),
        Utils = require('app/jira/utils'),
        template = require('hgn!app/jira/templates/page_template');
        
    function JiraPage () {
        BaseView.prototype.constructor.apply(this, arguments);
    }
    
    return BaseView.extend({
        ctor: JiraPage,
        commands: {
            'click.command .jira-deploy-email': 'DeployEmailNavigateCommand',
            'click.command .jira-jira-report': 'JiraReportNavigateCommand'
        },
        handlers: {
            onDraw: function () {
                $('#main-menu').metisMenu();
            }
        },
        init: function (options) {
            this.$el = options.el || $(document.body);
            _.extend(this.handlers, options.handlers || {});
            
            BaseView.prototype.init.apply(this, arguments);
        },
        finish: function () {
            this.$el.off();
            this.$el.empty();
            delete this.$el;
            Base.prototype.finish.apply(this, arguments);
        },
        draw: function () {
            var data = {},
                html = template(data),
                res = $.Deferred();
                
            this.$el.html(html);
            
            Utils.loadViews({
                jiraView: ['app/jira/views/jira_view', {
                    el: '#page-wrapper',
                    viewModel: this.viewModel
                }, {
                    filterView: ['app/jira/views/filter_view', {
                        el: '.filter-items-statuses',
                        viewModel: this.viewModel,
                        bindings: {
                            'change:statuses': function (view, viewModel) {
                                view.setItems(viewModel.getFilterItems());
                            }
                        }
                    }],
                    panelView: ['app/jira/views/panel_view', {
                        el: '.epics-panel',
                        title: 'Filter by Epic',
                        viewModel: this.viewModel
                    }, {
                        epicsView: ['app/jira/views/epics_view', {
                            el: '.filter-items-epics',
                            viewModel: this.viewModel,
                            bindings: {
                                'change:epics': function (view, viewModel) {
                                    view.setItems(viewModel.getEpics());
                                }
                            }
                        }]
                    }]
                }]
            }, this).done(_.bind(function () {
                this.handlers.onDraw.call(this);
                res.resolve(this);
            }, this));    
            
            return res.promise();  
        }
    });
});