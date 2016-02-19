using System;
using System.Collections.Generic;

namespace Rebelmouse.jira {
    public class Issue {
        public string id { get; set; }
        public string Key { get; set; }

        public IssueFields fields { get; set; }
    }
}
