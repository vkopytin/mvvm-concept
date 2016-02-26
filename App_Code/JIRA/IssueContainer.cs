using System.Collections.Generic;

namespace Rebelmouse.jira
{
    public class IssueContainer
    {
        public string expand { get; set; }

        public int maxResults { get; set; }
        public int total { get; set; }
        public int startAt { get; set; }

        public List<Issue> issues { get; set; }
    }
}