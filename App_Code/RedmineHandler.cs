using System;
using System.IO;
using System.Collections.Specialized;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Collections.Generic;

namespace n {

    public class RedmineHandler : IHttpHandler {

        private string host = "https://redmine.rebelmouse.com";
        private string apiKey = "";
        private string login = "";
        private string password = "";
        private string ImpersonateUser;

        public bool IsReusable {

            get { return false; }
        }

        public void ProcessRequest(HttpContext context) {

            var getString = Convert.ToString(context.Request.QueryString);
            var pathInfo = context.Request.PathInfo;
            var pathInfoArr = pathInfo.Split(new char[] {'/'});
            var serviceName = pathInfoArr[2];
            if (pathInfoArr.Length == 4) {
                serviceName += "/" + pathInfoArr[3];
            }
            var authInfo = pathInfoArr[1].Split(new char[] {';'});
            if (authInfo.Length == 3) {
                login = authInfo[0];
                password = authInfo[1];
                apiKey = authInfo[2];
            }
            var address = String.Format("{0}/{1}?{2}", host, serviceName, getString);
            

            context.Response.ContentType = "application/json; charset=utf-8";


            var s = ajax(new AjaxOptions {
                url = address,
                login = login,
                password = password,
                apiKey = apiKey,
                method = "GET"
            });

            context.Response.Write(s);
        }

        class AjaxOptions {
            public string url { get; set; }
            public string login { get; set; }
            public string password { get; set; }
            public string apiKey { get; set; }
            public string method { get; set; }
        }

        private string ajax(AjaxOptions options) {

            string authInfo = Base64Encode(_(options.login, options.password).Join(":"));
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(options.url);

            request.Headers.Add("Authorization", "Basic " + authInfo);
            request.Headers.Add("X-Redmine-API-Key", options.apiKey);
            request.Credentials = new NetworkCredential("username", "password");
            request.Method = options.method;
            request.AllowAutoRedirect = true;
            request.Proxy = null;

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream stream = response.GetResponseStream();
            StreamReader streamreader = new StreamReader(stream);

            string s = streamreader.ReadToEnd();

            return s;
        }

        public static T[] _<T>(params T[] args) {
            return args;
        }

        public static string Base64Encode(string str) {
            return Convert.ToBase64String(Encoding.Default.GetBytes(str));
        }

        public static string JsonSerializer<T>(T type)
        {
            try
            {
                var ser = new JavaScriptSerializer();
                //ser.RegisterConverters(new[] { converters[typeof(T)] });
                var jsonString = ser.Serialize(type);
                return jsonString;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }

    public static class StringArrayExtensions {

        public static string Join(this string[] input, string separator) {

            return String.Join(separator, input);
        }
    }
}
