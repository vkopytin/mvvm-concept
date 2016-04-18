using System;
using System.IO;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Collections.Generic;

namespace Rebelmouse.jira {
    public class JiraClient {

        private readonly string username;
        private readonly string password;
        private readonly JavaScriptSerializer deserializer = new JavaScriptSerializer();
        private readonly string baseApiUrl;
        private readonly string projectKey = "BRAD";

        public JiraClient(string baseUrl, string username, string password) {
            this.username = username;
            this.password = password;

            baseApiUrl = new Uri(new Uri(baseUrl), "rest/api/latest/").ToString();
        }

        public IEnumerable<Issue> Issues {
            get {
                return this.GetIssues();
            }
        }
        
        public IEnumerable<Status> Statuses {
            get {
                return this.GetStatuses();
            }
        }
        
        public IEnumerable<Issue> Epics {
            get {
                return this.GetEpics();
            }
        }
        
        public IEnumerable<Status> GetStatuses() {
            var statuses =  ExecuteRequest<IEnumerable<Status>>("GET", "status");
            
            return statuses;
        }
        
        public IEnumerable<Issue> GetEpics() {
            string[] fieldDef = null;
            var epics = EnumerateIssuesByQuery(CreateCommonJql(this.projectKey, "Epic"), fieldDef, 0);
            
            return epics;
        }

        public IEnumerable<Issue> GetIssues() {
            string issueType = null;
            string[] fieldDef = null;
            return EnumerateIssuesByQuery(CreateCommonJql(projectKey, issueType), fieldDef, 0);
        }
        
        public IEnumerable<Issue> GetIssuesByStatus(string[] status) {
            var inStatuses = string.Format("status IN ({0})", string.Join(",", status));
            string[] fieldDef = null;
            return EnumerateIssuesByQuery(CreateCommonJql(this.projectKey, new string[] { inStatuses }), fieldDef, 0);
        }
        
        public IEnumerable<Issue> GetIssuesByEpic(string[] epicLink) {
            var inEpics = string.Format("\"Epic Link\" IN ({0})", string.Join(",", epicLink));
            string[] fieldDef = null;
            return EnumerateIssuesByQuery(CreateCommonJql(this.projectKey, new string[] { inEpics }), fieldDef, 0);
        }
        
        public IEnumerable<Issue> GetIssues(string[] status, string[] epicLink) {
            var inStatuses = string.Format("status IN ({0})", string.Join(",", status));
            var inEpics = string.Format("\"Epic Link\" IN ({0})", string.Join(",", epicLink));
            string[] fieldDef = null;
            string jql = CreateCommonJql(this.projectKey, new string[] { inStatuses, inEpics });
            return EnumerateIssuesByQuery(jql, fieldDef, 0);
        }

        private string ExecuteRequest(string method, string path) {
            var url = string.Format("{0}{1}", this.baseApiUrl, path);
            var mergedCredentials = string.Format("{0}:{1}", this.username, this.password);
            var byteCredentials = Encoding.UTF8.GetBytes(mergedCredentials);
            var encodedCredentials = Convert.ToBase64String(byteCredentials);

            using (WebClient webClient = new WebClient())
            {
                webClient.Headers.Set("Authorization", "Basic " + encodedCredentials);

                return webClient.DownloadString(url);
            }
        }

        private T ExecuteRequest<T>(string method, string path) {
            string json = this.ExecuteRequest(method, path);

            return deserializer.Deserialize<T>(json);
        }
        
        private static string CreateCommonJql(string projectKey, string issueType)
        {
            var queryParts = new List<string>();
            
            if (!string.IsNullOrEmpty(projectKey))
                queryParts.Add(string.Format("project={0}", projectKey));
                
            if (!string.IsNullOrEmpty(issueType))
                queryParts.Add(string.Format("issueType={0}", issueType));
                
            queryParts.Add("status != Done");
            queryParts.Add("status != Rejected");
                
            return string.Join(" AND ", queryParts) + " ORDER BY priority DESC";
        }
        
        private static string CreateCommonJql(string projectKey, string[] filterBy)
        {
            var queryParts = new List<string>();
            
            if (!string.IsNullOrEmpty(projectKey)) {
                queryParts.Add(string.Format("project={0}", projectKey));
            }

            queryParts.AddRange(filterBy);
                
            return string.Join(" AND ", queryParts) + " ORDER BY priority DESC";
        }
        
        public IEnumerable<Issue> EnumerateIssuesByQuery(string jqlQuery, string[] fields, Int32 startIndex)
        {
            try
            {
                return EnumerateIssuesByQueryInternal(Uri.EscapeUriString(jqlQuery), fields, startIndex);
            }
            catch (Exception ex)
            {
                return new List<Issue>() { new Issue { id="error", Key=ex.Message } };
            }
        }
        
        private IEnumerable<Issue> EnumerateIssuesByQueryInternal(string jqlQuery, string[] fields, Int32 startIndex)
        {
            var queryCount = 50;
            var resultCount = startIndex;
            while (true)
            {
                var path = String.Format("search?jql={0}&startAt={1}&maxResults={2}", jqlQuery, resultCount, queryCount);
                if (fields != null) path += String.Format("&fields={0}", String.Join(",", fields));

                var response = ExecuteRequest("GET", path);
                
                // Convert a string to utf-8 bytes.
                byte[] utf8Bytes = System.Text.Encoding.Default.GetBytes(response);
	
                // Convert utf-8 bytes to a string.
                string s_unicode2 = System.Text.Encoding.UTF8.GetString(utf8Bytes);

                var data = deserializer.Deserialize<IssueContainer>(s_unicode2);
                var issues = data.issues ?? Enumerable.Empty<Issue>();

                foreach (var item in issues) yield return item;
                resultCount += issues.Count();

                if (resultCount < data.total) continue;
                else /* all issues received */ break;
            }
        }
    }
}
