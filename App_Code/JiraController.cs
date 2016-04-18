using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Ajax;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;

using Rebelmouse.jira;

namespace hellomvc.Controllers
{
    public class JiraController : Controller
    {
        static string URL = Config.JiraConfig["url"];
        static string jUserID = Config.JiraConfig["user"];
        static string jPassword = Config.JiraConfig["password"];

        public ActionResult Index ()
        {
            var mvcName = typeof(Controller).Assembly.GetName ();
            var isMono = Type.GetType ("Mono.Runtime") != null;

            ViewData ["Version"] = mvcName.Version.Major + "." + mvcName.Version.Minor;
            ViewData ["Runtime"] = isMono ? "Mono" : ".NET";
            ViewData ["Title"] = "C# MVC - Razor";
            ViewData ["ModuleName"] = "jira";
            ViewData ["bootstrap"] = new {
                issues = this.GetIssues("")
            };

            return View ();
        }
        
        [HttpGet]
        public ActionResult Issues(string status="") {
            var items = this.GetIssues(status);

            return Json(items, JsonRequestBehavior.AllowGet);
        }
        
        private IEnumerable<Issue> GetIssues(string status) {
            var jiraClient = new JiraClient(URL, jUserID, jPassword);
            var items = default(IEnumerable<Issue>);
            
            if (string.IsNullOrEmpty(status)) {
                items = jiraClient.Issues;
            } else {
                items = jiraClient.GetIssuesByStatus(status.Split(','));
            }
            
            return items;
        }
        
        [HttpGet]
        public ActionResult Bookmarklet() {
            var js = @"(function (root, doc) {
    var Utils = {
            elFromString: function (textHTML) {
                var el = document.createElement('div');

                el.innerHTML = textHTML;

                return el.firstChild;
            }
        },
        template = {
            text: '\
<iframe \
  id=""${uniqueId}"" seamless=""seamless"" frameBorder=""0"" \
  class=""jira-worktool-bookmarklet-iframe jira-dialog box-shadow jira-dialog-open popup-width-custom jira-dialog-content-ready"" \
  src=""${src}?referrer=${referrer}&__rmsp=-1&r=${time}"" height=""100%"" \
  width=""100%"" scrolling=""yes"" allowTransparency=""true"" \
  style=""position: fixed;top:10%;left:10%;z-index: 999;border: 1px solid gray;height: 80%;width: 80%;""\
 ></iframe>\
            ',
            render: function (options) {
                var html = this.text.replace(/\${([a-zA-Z0-9_]+)}/g, function (match, prop) {
                        if (prop in options) {
                            return options[prop];
                        }
                        return '';
                    });

                return html;
            }
        },
        BookmarkletBar = function (options) {
            this.onMessageHandler = this.onMessage.bind(this);

            this.init(this.options = options);
        },
        impl = {
            template: template,
            init: function (options) {
                root.addEventListener('message', this.onMessageHandler, false);
            },
            onMessage: function (evnt) {
                var data = evnt.data || '',
                    pair = data.split(':'),
                    namespace = pair[0],
                    command = pair[1];

                if (namespace !== 'bookmarklet') {
                    return false;
                }
                if (command === 'close') {
                    this.close();
                }
            },
            close: function () {
                this.el.parentNode.removeChild(this.el);
                root.removeEventListener('message', this.onMessageHandler);
                delete this['el'];
            },
            render: function () {
                var data = this.options,
                    html = template.render(data),
                    el = Utils.elFromString(html);

                doc.body.appendChild(el);
                this.el = doc.getElementById(uniqueId);

                return this;
            }
        },
        uniqueId = 'jira-worktool-bookmarklet-iframe';

    BookmarkletBar.prototype = impl;

    doc.getElementById(uniqueId) && doc.getElementById(uniqueId).remove();

    new BookmarkletBar({
        uniqueId: uniqueId,
        src: 'https://dev.local/mvc/jira',
        time: +new Date()
    }).render();

}(window, window.document));";
            return this.Content(js, "application/javascript");
        }
    }
}
