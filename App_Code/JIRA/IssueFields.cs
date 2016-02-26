using System;
using System.Collections.Generic;

namespace Rebelmouse.jira {
    public class IssueFields {
        
        public IssueFields()
        {
            status = new Status();

            labels = new List<String>();
            comments = new List<Comment>();
            watchers = new List<JiraUser>();
            priority = new Priority();
        }
        
        public string summary { get; set; }
        public string description { get; set; }
        public Status status { get; set; }
        public Priority priority { get; set; }
        
        public JiraUser reporter { get; set; }
        public JiraUser assignee { get; set; }
        public List<JiraUser> watchers { get; set; }
        
        public List<String> labels { get; set; }
        public List<Comment> comments { get; set; }
        
        public string created { get; set; }
        public string updated { get; set; }
    }
}
