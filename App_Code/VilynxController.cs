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
using System.Net;
using System.ServiceModel;
using System.Xml;
using System.ServiceModel.Syndication;
using System.IO;
using System.Web.Script.Serialization;

using Rebelmouse.jira;

namespace hellomvc.Controllers
{
    public class VilynxController : Controller
    {
        private string baseApiUrl = "http://elivilynx.webfactional.com";
        
        public ActionResult Index ()
        {
            var mvcName = typeof(Controller).Assembly.GetName ();
            var isMono = Type.GetType ("Mono.Runtime") != null;

            ViewData ["Version"] = mvcName.Version.Major + "." + mvcName.Version.Minor;
            ViewData ["Runtime"] = isMono ? "Mono" : ".NET";
            ViewData ["Title"] = "C# MVC - Razor";
            ViewData ["ModuleName"] = "vilynx";

            return View ();
        }
        
        [HttpGet]
        public ActionResult Items(int from=0, int count=10) {
            var res = this.RequestVilynxItems(from, count);
            
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        
        public class HashesContainer {
            public string date { get; set; }
            public List<HashItem> hashes { get; set; }
            
            public HashesContainer () {
                hashes = new List<HashItem>();
            }
        }
        
        public class HashItem {
            public List<string> url { get; set; }
            public List<string> hash { get; set; }
            
            public HashItem() {
                url = new List<string>();
                hash = new List<string>();
            }
        }
        private readonly JavaScriptSerializer deserializer = new JavaScriptSerializer();
        private object RequestVilynxItems(int from, int count) {
            var items = this.GetRSSItems((node, nsmgr) => {
                var content = node.SelectSingleNode("//media:content/@url", nsmgr);
                return new {
                        title = node.SelectSingleNode("title").InnerText,
                        link = node.SelectSingleNode("link").InnerText,
                        content = content == null ? "" : content.Value
                    };
            });
            var url = @"/get_hashes.php?owner=7114e1b1c1cfa90b5feef0f3c1da9733&url=";
            
            var itemsRss = items.Select(item => {
                var json = this.ExecuteRequest("GET", url + item.link, "http://www.vilynx.com");
                var hashes = deserializer.Deserialize<HashesContainer>(json);
                if (hashes == null) {
                    hashes = new HashesContainer();
                }
                return new {
                    title = item.title,
                    link = item.link,
                    content_url = item.content,
                    json = json,
                    hashes = hashes.hashes.Take(10),
                    vilynx_id = "7114e1b1c1cfa90b5feef0f3c1da9733"
                };
            });
            
            return new {
                from = from,
                count = count,
                data = itemsRss.Select(item => {
                    return (object)item;
                }).Skip(from).Take(count).ToList()
            };
        }
        
        private List<T> GetRSSItems<T>(Func<XmlNode, XmlNamespaceManager, T> func) {
            var rss = this.ExecuteRequest("GET", "/elconfidencial.xml");
            List<T> res = new List<T>();
            
            XmlReaderSettings settings = new XmlReaderSettings();
            settings.IgnoreComments = true;
            settings.DtdProcessing = DtdProcessing.Ignore;
            settings.IgnoreProcessingInstructions = true;
            settings.IgnoreWhitespace = true;
            settings.ValidationType = ValidationType.None;
            settings.CheckCharacters = false;
            settings.ProhibitDtd = true;
            
            using(XmlReader reader = XmlReader.Create(new StringReader(rss.Replace("&", "&amp;")), settings)) {
                XmlDocument doc = new XmlDocument();
                XmlNamespaceManager nsmgr = new XmlNamespaceManager(doc.NameTable);
                nsmgr.AddNamespace("media", "http://search.yahoo.com/mrss/");
                doc.XmlResolver = null;
                doc.Load(reader);
                XmlNodeList items = doc.GetElementsByTagName("item");
                foreach (XmlNode node in items) {
                    res.Add(func(node, nsmgr));
                }
            }
            
            return res;
        }
        
        private string ExecuteRequest(string method, string path) {
            
            return this.ExecuteRequest(method, path, this.baseApiUrl);
        }
    
    	private string ExecuteRequest(string method, string path, string host) {
            var url = string.Format("{0}{1}", host, path);
            //var mergedCredentials = string.Format("{0}:{1}", this.username, this.password);
            //var byteCredentials = Encoding.UTF8.GetBytes(mergedCredentials);
            //var encodedCredentials = Convert.ToBase64String(byteCredentials);

            using (WebClient webClient = new WebClient())
            {
                //webClient.Headers.Set("Authorization", "Basic " + encodedCredentials);

                return webClient.DownloadString(url);
            }
        }
    }
}
