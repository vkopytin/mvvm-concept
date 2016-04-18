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
using System.Threading.Tasks;

using Rebelmouse.jira;

namespace hellomvc.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index ()
        {
            var mvcName = typeof(Controller).Assembly.GetName ();
            var isMono = Type.GetType ("Mono.Runtime") != null;

            ViewData ["Version"] = mvcName.Version.Major + "." + mvcName.Version.Minor;
            ViewData ["Runtime"] = isMono ? "Mono" : ".NET";
            ViewData ["Title"] = "C# MVC - Razor";
            ViewData ["ModuleName"] = "main";
            ViewData ["assemblies"] = GetAssemblies();

            return View ();
        }

        [HttpGet]
        public ActionResult Assemblies() {
            return Json(AppDomain.CurrentDomain.GetAssemblies().Select((a) => {
                var name = a.GetName();
                var fullName = name.FullName;
                var guid = "";
                var attrs = a.GetCustomAttributes(false).OfType<GuidAttribute>();
                if (attrs.Any()) {
                    guid = attrs.First().Value;
                }
                var id = CalculateMD5Hash(fullName);

                var location = "";
                try {
                    location = a.Location;
                }
                catch (Exception ex) {
                    location = ex.Message;
                }
                return new {
                    id = id,
                    guid = guid,
                    fullName = fullName,
                    location = location,
                    publicKey = GetPublicKeyTokenFromAssembly(a)
                };
            }).ToList(), JsonRequestBehavior.AllowGet);
        }

        static string URL = Config.JiraConfig["url"];
        static string jUserID = Config.JiraConfig["user"];
        static string jPassword = Config.JiraConfig["password"];

        [HttpGet]
        [AsyncTimeout(8000)]
        public Task<ActionResult> Issues(string status="", string epicLink="") {
            return Task.Factory.StartNew(() => {
            var jiraClient = new JiraClient(URL, jUserID, jPassword);
            var items = default(IEnumerable<Issue>);
            
            if (string.IsNullOrEmpty(status) && string.IsNullOrEmpty(epicLink)) {
                items = jiraClient.Issues;
            } else if (string.IsNullOrEmpty(status)) {
                items = jiraClient.GetIssuesByEpic(epicLink.Split(','));
            } else if (string.IsNullOrEmpty(epicLink)) {
                items = jiraClient.GetIssuesByStatus(status.Split(','));
            } else {
                items = jiraClient.GetIssues(status.Split(','), epicLink.Split(','));
            }

            return (ActionResult)Json(items, JsonRequestBehavior.AllowGet);});
        }
        
        [HttpGet]
        public ActionResult Statuses() {
            var jiraClient = new JiraClient(URL, jUserID, jPassword);
            var items = jiraClient.Statuses;

            return Json(items, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Epics() {
            var jiraClient = new JiraClient(URL, jUserID, jPassword);
            var items = jiraClient.Epics;

            return Json(items, JsonRequestBehavior.AllowGet);
        }

        public string CalculateMD5Hash(string input) {
            // step 1, calculate MD5 hash from input
            MD5 md5 = MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);
         
            // step 2, convert byte array to hex string
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString();
        }

        private string GetAssemblies() {
            var itemTpl = "<li><div>{0}</div><div>{1}</div></li>";
            var assemblies = "<ul>";
            foreach (Assembly a in AppDomain.CurrentDomain.GetAssemblies()) {
                var fullName = a.GetName().FullName;
                var location = "";
                try {
                    location = a.Location;
                }
                catch (Exception ex) {
                    location = ex.Message;
                }
                assemblies += string.Format(itemTpl,fullName, location);
            }
            assemblies += "</ul>";
            return assemblies;
        }

        private static string GetPublicKeyTokenFromAssembly(Assembly assembly)
        {
            var bytes = assembly.GetName().GetPublicKeyToken();
            if (bytes == null || bytes.Length == 0)
                return "None";

            var publicKeyToken = string.Empty;
            for (int i = 0; i < bytes.GetLength(0); i++)
                publicKeyToken += string.Format("{0:x2}", bytes[i]);

            return publicKeyToken;
        }
    }
}
